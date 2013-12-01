/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 22:55
 */

var path = require('path');
var fs = require('fs');

function init(callback) {
    var settingsFile = path.join(__dirname, 'settings.json');
    fs.exists(settingsFile, function(exists){
        if (exists) {
            return readSettings(settingsFile, callback);
        } else {
            settingsFile = path.join(__dirname, '../settings.json');
            fs.exists(settingsFile, function(exists){
                if (exists) {
                    return readSettings(settingsFile, callback);
                } else {
                    return callback('settings.json not found');
                }
            });
        }
    });
}

function readSettings(settingsFile, callback){
    fs.readFile(settingsFile, function (err, data) {
        if (err) { return callback(err); }
        try{
            var config = JSON.parse(data);
            config.apps = {};
            config.apps.find = find;
            config.apps.apps = config.applications;
            delete config.applications;
        } catch(err){
            return callback(err);
        }
        return callback(null, config);
    });
}

function find(name) {
    var applications = this.apps;
    for(var app in applications) {
        if (applications.hasOwnProperty(app)) {
            if (app === name) {
                return applications[app];
            }
        }
    }
    return null;
}

module.exports = {
    init : init
};



