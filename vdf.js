var fs = require('fs');
var vdf = require('vdfjs');
var dotaFile = fs.readFileSync('dota_english.txt', 'utf-8');

var data = vdf.parse(dotaFile); // Returns a JS object representing the input file
console.log(data);

fs.writeFile('output.json', JSON.stringify(data, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    });