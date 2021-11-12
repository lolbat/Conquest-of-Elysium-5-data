# Ritual Summons data format
This document is based on the data format used for Conquest of Elysium 5.10. In order to use this document you will need a copy of the Conquest of Elysium 5 application as well as a hex editor. This document was written on a Mac and was built using [HextEdit](https://www.hextedit.app)  and [Hex Fiend](https://hexfiend.com) both of which are free. I use both apps as each has their strengths and weaknesses.

The Hex Fiend app also has the capability to run templates that will help display data and if there is enough time I may make some templates for the app to help people figure out the CoE5 data formats.

The [CoE5 Data repository][coe5data] has several sample files, in the `/hex` directory that you can use as samples. If you want to be able to view multiple files at once then you should check out [Hex Works](http://hex-works.com/eng). It is a web based app that will let you view and mark multiple files at once. It is a bit old and has some bugs but it is useful.

It isn't totally necessary but you may find an application like [Bit Fiddle](https://manderc.com/apps/bitfiddle/index_en.php) useful as well. It is available in Mac and  Windows formats and all it does is display data in hex, decimal and binary values. 

All of my code is written in Javscript using the [Node.js](https://nodejs.org/en/) framework. I also use an npm package called [binary-file](https://www.npmjs.com/package/binary-file) to help read out the binary data from the CoE5 executable.

Sadly none of the tools appear to be able to take parameters in hex format.

Special thanks to Colonel Dracula joins the Navy who wrote some helpful notes on the CoE4 data format and pencils for helping me get sample ritual data from CoE4.

**Important**: make a backup of your CoE5 executable and work on that. IF you have a hex editor that supports it then always work in read-only mode. 

## Missing rituals

Some of the rituals in the game are not present in the ritual section. They appear to be hardcoded into the game logic. These include, at the time of this writing,:

- Raise Dead
- Summon Planar Being
- Reanimate Animals
- Minor Animal Summoning (Dryad Queen)
- Major Animal Summoning (Dryad Queen)

In addition, the entire range of Voice of El faction rituals are not listed. These also seem to be hardcoded.

## Start

All of the ritual data is stored consecutively in the CoE5 application. Each binary has a different start location.

| Platform | Decimal | Hex |
|--|--|--|
| Mac | 34043936 | 0x2077806 |
| Windows | 34759104 | 0x21261C0 |
| Linux | 18648208 | 0x11C8C90 |

These start locations may change from version to version so make sure to search for the start of ritual section. It starts with a *Lesser Ritual of Mastery* so you can jump to the offset and search from there.

Most, but not all, of the series of rituals start with a three ritual block (Lesser, Major and Ritual of Grand Mastery) and then start with the rituals that are unique to each faction.  Not all do so make sure that you parse the entire section as there are some rituals that are posted without those three at them beginning of a faction block.

Each ritual entry is 12624 (0x3150) bytes in length. There doesn't appear to be any data at the head of the rituals section to tell how many entries there but the entire rituals section is demarcated by a 95 (0x60) byte footer at the end.

```hex
656E 6400 0000 0000 0000 0000 0000 0000 0000 
0000 0000 0000 0000 0000 0000 0000 0000 0000 
0000 0000 0000 0000 0000 0000 19FC FFFF 19FC 
FFFF FFFF FFFF 0000 0000 0000 0000 0000 0000 
0000 0000 0000 0000 0000 0000 0000 0000 0000 
0000 FFFF FFFF
```
The first three bytes spell out `end`.

Since `end` is a common string you can instead  test for 

```hex
19FC FFFF 19FC FFFF FFFF FFFF
```
which appears to be a unique structure in the app in all three versions.

## Data format
What follows is an examination of the ritual data. Please note that this is current as of version 5.10 of the Conquest of Elysium game. All of the offsets/positions mentioned below are 0 indexed from the start of an individual ritual data packet. My code is written on Node.js and the `Buffer` class in Node is 0 indexed as are many languages.

### Name

The first 48 (0x30) bytes are reserved for the ritual name. So bytes 0 - 47 in the ritual. This is just UTF-8 encoded single byte ASCII characters and so is simple enough to translate into text.

```hex
4C 65 73 73 65 72 20 43 65 72 65 6D 6F 6E 79 20 
74 6F 20 42 61 61 6C 00 00 00 00 00 00 00 00 00 
00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
```
translates to
```
Lesser Ceremony to Baal
```
If you are using Node.js, the [`.toString()`](https://nodejs.org/dist/latest-v16.x/docs/api/buffer.html#buftostringencoding-start-end) function of the `Buffer` class will convert and trim the data for you. 

### Hardcoded values

The ritual faction and some hardcoded costs are represented in a series of 4 byte sets starting at offset 48 (0x30) after the ritual name.

There are typically 4 sets of 4 byte instruction sets but sometimes there are more. For example *Kobold Stronghold* has 6 sets of 4 byte cost instructions. The instruction block is delineated by a sequence of four FF bytes. 

This is the instruction block for *Minor Summoning*

```hex
F501 0000 0100 0000 0500 0000 0A00 0000 FFFF FFFF
```

and this is the instruction set for *Kobold Stronghold*

```hex
2702 0000 0200 0000 0000 0000 3200 0000 0100 0000 4B00 0000 FFFF FFFF
```
The data is read in four byte sequences until we hit the end delimiter

```hex
2702 0000 
0200 0000 
0000 0000 
3200 0000 
0100 0000 
4B00 0000 
FFFF FFFF
```
There are no flags or instructions to tell you what the cost values are for. These are hardcoded into the app and they just have to be 'sussed out'.

In CoE4 the sets were assigned to (using the mod commands)

- ritpow
- level
- cost
- cost two *because some rituals require two different resources*
- whether the ritual requires two different resources *0 if no -1 if yes*
- terr

#### Ritual Power

The ritual power value is the first instruction set. It is recorded as two bytes , 0x2702 in the Kobold Stronghold, but is stored as a reverse hex value. So instead of 0x2702 the value is read as 0x0227 which is 551 decimal. You then subtract 500 from that to get the ritual power of 51. Typically this sort of format is used for instances when the second byte of the two may not be present. The unit data format uses this for the unit id and only uses the first of the two bytes for values below 256. I am not sure why it is being used in this instance.

The `ritpow` numbers can be found on the Ritual Schools table on the CoE5 [Modding Documentation page](http://www.illwinter.com/coe5/coe5modding.html).



[coe5data]:https://github.com/lolbat/Conquest-of-Elysium-5-data