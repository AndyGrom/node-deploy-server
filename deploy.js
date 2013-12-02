/**
 * Author: Andrey Gromozdov
 * Date: 01.12.13
 * Time: 21:17
 */

var path = require('path');
var fs = require('fs');
var config = require('./configuration');

function plugins(options, callback) {
    readPlugins(options.moduleName, function(pluginList){
        var current = -1;
        (function runPlugin(data, callback) {
            current++;
            if (current < pluginList.length) {
                data.log.push('PLUGIN: ' + pluginList[current].name);
                pluginList[current].plugin(data, function(err, options){
                    if (err) {
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
                    "./plugins/unpack",
                    "./plugins/installDependencies"
                ];
            }

            for(var i = 0; i < pluginFiles.length; i++) {
                var plugin = require(pluginFiles[i]).plugin;
                if (!pluginList[appName]) {
                    pluginList[appName] = [];
                }
                pluginList[appName].push( { name: pluginFiles[i], plugin: plugin } );
            }
        }

        return {start : plugins };
    }
}

module.exports = readPlugins(null, null);

