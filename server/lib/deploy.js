/**
 * Author: Andrey Gromozdov
 * Date: 01.12.13
 * Time: 21:17
 */

var path = require('path');
var fs = require('fs');
var config = require('./configuration').get();

var pluginModules = {
    unpack : require('../plugins/unpack'),
    installDependencies : require('../plugins/installDependencies'),
    startProcess : require('../plugins/startProcess')
}

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

var pluginList = null;
function readPlugins(appName, callback){
    if (appName) {
        process.nextTick(function(){
            callback(pluginList[appName]);
        });
    } else {
        pluginList = {};
        for (var appName in config.applications) {
            init(appName);
        }

        return {
            start : plugins,
            init : init
        };
    }
}

function init(appName) {
    pluginList[appName] = null;
    var pluginFiles = [
        "unpack",
        "installDependencies"
    ];
    if (config.applications[appName].startProcess) {
        pluginFiles.push('startProcess');
    }

    for(var i = 0; i < pluginFiles.length; i++) {
        if (!pluginList[appName]) {
            pluginList[appName] = [];
        }

        var name = pluginFiles[i];
        var plugin = pluginModules[name];
        pluginList[appName].push( { name: name, plugin: plugin } );
    }
}

module.exports = readPlugins(null, null);

