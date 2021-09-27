#!/bin/sh

csvfiles=`ls *.csv`
currentDir=${PWD##*/} 

for eachfile in $csvfiles
do
   noext=${eachfile%%.*}
   node /usr/local/lib/node_modules/csvtojson/bin/csvtojson ./$eachfile > ../../json/$currentDir/$noext.json
done