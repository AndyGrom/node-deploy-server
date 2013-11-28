/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 22:55
 */

var path = require('path');
var fs = require('fs');

function init(callback) {
    fs.readFile(path.join(__dirname, 'settings.json'), function (err, data) {
        if (err) { return callback(err); }
        try{
            var config = JSON.parse(data);
            config.applications.find = find;
        } catch(err){
            return callback(err);
        }
        return callback(null, config);
    });
}

function find(name) {
    for(var app in this) {
        if (this.hasOwnProperty(app)) {
            if (app === name) {
                return this[app];
            }
        }
    }
    return null;
}

module.exports = {
    init : init
};



