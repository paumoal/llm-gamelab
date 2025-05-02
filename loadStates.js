const fs = require('fs');
const { findinits } = require('./player')

const { definerules, readdata } = require('./epilog');

const args = process.argv.slice(2); //utilizar los argumentos desde python

const [game] = args;

const rulesFilePath = `./downloads/${game}_rulesheet.hrf`;
const stylesheetPath = `./downloads/${game}_stylesheet.js`;

indexing = false;
dataindexing = false;
ruleindexing = true;

var library = [];
//var state = [];

var rulesheet = fs.readFileSync(rulesFilePath, 'utf8');
definerules(library, readdata(rulesheet));
var stylesheet = fs.readFileSync(stylesheetPath, 'utf8');
try { eval(stylesheet) } catch (err) {
    // console.log('stylesheet error.') 
};

state = findinits(library);

console.log(JSON.stringify({ 'board': state }))

process.exit(1);