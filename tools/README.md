## Tools

### Convert
There is a shell script `convert.sh` that will convert all of the `.csv` files into a directory using the csvtojson node library. It will copy the resulting `.json` files to the same subdirectory in the` /json` directory as long as it exists. So you can use it to convert all of the files in the `/csv/mods/` directory and create files in the` /json/mods/` directory

### ConvertModsJSON.js

The `convertModsJSON.js` file is used for  processing the `modcommands.json`  file into a nested format. It is a node.js file that is meant to be used on the command line.

`node convertModsJSON.js`

### processRitualCosts.js

The `processRitualCosts.js` is used to denormalize the COST key into an array that we will use to create a cost display that uses the sprites from the game.   It is a node.js file that is meant to be used on the command line.

`node processRitualCosts.js`

### processModCommands.js

Creates the `modCommands` top-level key and then processes the `hint` key and replaces the < and > characters with HTML entities so they display properly in the Almanac. It is a node.js file that is meant to be used on the command line.

`node processModCommands.js`

