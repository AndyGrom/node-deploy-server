/**
 * Author: Andrey Gromozdov
 * Date: 01.12.13
 * Time: 21:17
 */

var path = require('path');
var fs = require('fs');
var config = require('./configuration');
var mkdirp = require('mkdirp');

function plugins(options, callback) {
    readPlugins(options.moduleName, function(pluginList){
        var current = -1;
        (function runPlugin(data, callback) {
            current++;
            if (current < pluginList.length) {
                data.log.push('PLUGIN: ' + pluginList[current].name);
                pluginList[current].plugin(data, function(err, options){
                    if (err) {
                        options.log.push(err);
                        return callback(err, options);
                    } else {
                        runPlugin(options, callback);
                    }
                });
            } else {
                callback(null, options);
            }
        }(options, callback));
    });
}

var pluginList = {};
function readPlugins(appName, callback){
    if (appName) {
        process.nextTick(function(){
            callback(pluginList[appName]);
        });
    } else {

        for (var appName in config.applications) {
            var pluginFiles = config.applications[appName].plugins;
            if (!pluginFiles) {
                pluginFiles = [
                    "unpack",
                    "installDependencies"
                ];
            }

            for(var i = 0; i < pluginFiles.length; i++) {
                if (!pluginList[appName]) {
                    pluginList[appName] = [];
                }

                var name = pluginFiles[i];
                var pluginFile = path.join(__dirname, '../plugins', name);
                if (!fs.existsSync(pluginFile)) {
                    pluginFile = name;
                }
                if (!fs.existsSync(pluginFile)) {
                    console.warn('WARN: '.yellow + ' plugin ' + pluginFile + ' not found');
                } else {
                    var plugin = require(pluginFile);
                    pluginList[appName].push( { name: name, plugin: plugin } );
                }
            }
        }

        return {start : plugins };
    }
}

module.exports = readPlugins(null, null);

