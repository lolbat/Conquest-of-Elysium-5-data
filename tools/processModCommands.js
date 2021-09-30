// take the basic modcommands.json file and create a root node for it.
// also replace all the key values that have < or > symbols in them to HTML encoded values

// uses node.js 

const fs = require('fs');

let jsonFilePath = "../json/mods/modcommands.json";
let jsonWritePath = "../json/mods/modcommands_processed.json";

// read in the data and then parse the JSON into an object
let jsonString = fs.readFileSync(jsonFilePath).toString();
let jsonObj = JSON.parse(jsonString);
let finalJSON = {"modCommands":[]};

// iterate over each object and process the Hint key
jsonObj.forEach(commandObj => {
  
  let commandHint = commandObj['Hint'];
  
  // check to see if the Hint key value has a < or > character
  if (commandHint.indexOf('<') !== -1) {
    
    //lets convert some tags
    commandHint = commandHint.replace(/</g, '&lt;');
    commandHint = commandHint.replace(/>/g, '&gt;');
    
    commandObj['Hint'] = commandHint; // do I even need this?
    
  }
  
  // push this processed object into the new object we made
  finalJSON['modCommands'].push(commandObj);
  
});

// now string it out
let newJSONData = JSON.stringify(finalJSON, null, 4);
 
// write file to disk
fs.writeFileSync(jsonWritePath, newJSONData);