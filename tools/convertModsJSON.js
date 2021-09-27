// convert the mods json file into a nested JSON file while creating a tree of commands to make
// it easier to traverse and display the data

// uses node.js and d3

function arraysEqual(a, b) {
  
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
  
}

const fs = require('fs');
const d3 = require('d3-collection'); 

let jsonFilePath = "../json/mods/modcommands.json";
let jsonWritePath = "../json/mods/modcommands_nested.json";

// read in the data and then parse the JSON into an object
let jsonString = fs.readFileSync(jsonFilePath).toString();
let jsonObj = JSON.parse(jsonString);

//now lets use d3 to nest the JSON data by category and then type
let nestedJSON = d3.nest()
  .key(function(d) { return d.Category; })
  .key(function(d) { return d.Type; })
  .map(jsonObj);

// lets iterate over the JSON object and move any items that don't have type key
let keyList = Object.keys(nestedJSON);
keyList.forEach(key => {
  
  let subkeyList = Object.keys(nestedJSON[key]);
  if (arraysEqual(subkeyList, ['$'])) {
    
    // the key has no subkeys so move the data from the key below to the top
    let subData = nestedJSON[key]['$'];
    nestedJSON[key] = subData;
    
  }
  
});

// now string it out
let newJSONData = JSON.stringify(nestedJSON);
 
// write file to disk
fs.writeFileSync(jsonWritePath, newJSONData);