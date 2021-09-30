// denormalise the Ritual costs into a object with the type and number of resources so we can
// use that later to build a display using sprites from the game

// Also create a top-level node and then push each new object into that. It needs to be called rituals

// uses node.js 

const fs = require('fs');

let jsonFilePath = "../json/Rituals.json";
let jsonWritePath = "../json//Rituals_processed.json";

// read in the data and then parse the JSON into an object
let jsonString = fs.readFileSync(jsonFilePath).toString();
let jsonObj = JSON.parse(jsonString);
let finalJSON = {"rituals":[]};

// iterate over each object and process the COST key
jsonObj.forEach(ritualObj => {
  
  let ritualCost = ritualObj['COST'];
  
  if (ritualCost !=='-') {
    
    // split the string
    costArray = ritualCost.split(';')
    
    // trim the items to get any trailing spaces and then split by spaces
    costItems = costArray.map(item => item.trim().split(' '));
    
    // create a new array with an integer and the resource
    finalArray = costItems.map(items => [parseInt(items[0]), items[1]]);
    
    // create a set of HTML items as well
    htmlArray = finalArray.map(items => `<span class='ritualCostSpan'>${items[0]}<img class='ritCostImage' src='img/${items[1]}.png' /></span>`);
    
    // save the data 
    ritualObj['costHTML'] = htmlArray.join(''); // combine it into one string to remove the array delimiters when we display it
    ritualObj['costSplit'] = finalArray;
    
  } else {
    
    // no cost so the keys are empty
    ritualObj['costSplit'] = [];
    ritualObj['costHTML']  = [];
    
  }
  
  // push this processed object into the new object we made
  finalJSON['rituals'].push(ritualObj);
  
});

// now string it out
let newJSONData = JSON.stringify(finalJSON, null, 4);
 
// write file to disk
fs.writeFileSync(jsonWritePath, newJSONData);