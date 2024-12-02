//// copy this script after adding your stimulus to the directory
const string_stimuli = JSON.stringify(trial_objects, null, 2); // Pretty-print JSON with 2-space indentation
const   fs = require('fs'); // File system module
fs.writeFileSync('stimuli.json', string_stimuli); // Write the JSON object to a file
console.log('Stimuli.js file converted to json and saved to stimuli.json'); // Log the success message

/// the terminal command is node stimuli.js it includes the code above that will the trial objects into a stimuli.json file
