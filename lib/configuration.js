/**
 * Author: Andrey Gromozdov
 * Date: 03.12.13
 * Time: 1:00
 */

var path = require('path');
var fs = require('fs');
var colors = require('colors');

var fileName = 'nodehosting.json';
var paths = [
    path.join('/etc', fileName),
    path.join(__dirname, '../', fileName),
    path.join(__dirname, '../../',  fileName)
];

var notFoundException = 'ERROR: '.red + fileName + ' not found. Create the file:\n' + paths.join(' or \n');

var settingsFile;
var settings;
for (var i = 0; i < paths.length; i++) {
    if (fs.existsSync(paths[i])) {
        settingsFile = paths[i];
        break;
    }
}

if (!settingsFile) {
    console.error(notFoundException);
    process.exit(-1);
} else {
    settings = require(settingsFile);
    if (!settings.applications) {
        settings.applications = {};
    }
}

function save(data, callback) {
    fs.writeFile(settingsFile, JSON.stringify(data, null, 4), function(err){
        if (!err) {
            settings = data;
        }
        callback(err);
    });
}

module.exports = {
    get : function() { return settings; },
    set : save
};