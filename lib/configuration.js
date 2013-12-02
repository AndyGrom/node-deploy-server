/**
 * Author: Andrey Gromozdov
 * Date: 03.12.13
 * Time: 1:00
 */

var path = require('path');
var fs = require('fs');
var colors = require('colors');

var fileName = 'node-hosting.json';
var paths = [
    path.join('/etc', fileName),
    path.join(__dirname, '../', fileName),
    path.join(__dirname, '../../',  fileName)
];

var notFoundExcepton = 'ERROR: '.red + fileName + ' not found.\nPut the file in a folder:\n' + paths.join(' or \n');

var settingsFile;
var settings;
for (var i = 0; i < paths.length; i++) {
    if (fs.existsSync(paths[i])) {
        settingsFile = paths[i];
        break;
    }
}

if (!settingsFile) {
    console.error(notFoundExcepton);
    process.exit(-1);
} else {
    var data = fs.readFileSync(settingsFile);
    settings = JSON.parse(data);
}

module.exports = settings;