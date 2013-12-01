/**
 * Author: Andrey Gromozdov
 * Date: 01.12.13
 * Time: 21:17
 */

var path = require('path');
var fs = require('fs');

function plugins(options, callback) {
    readPlugins(function(pluginList){
        var current = -1;
        (function runPlugin(data, callback) {
            current++;
            if (current < pluginList.length) {
                pluginList[current](data, function(err, options){
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

var pluginList = [];
function readPlugins(callback){
    if (pluginList.length > 0) {
        process.nextTick(function(){
            callback(pluginList);
        });
    } else {
        var pluginOptions = path.join(__dirname, 'plugins.json');
        var data = fs.readFileSync(pluginOptions);

        var pluginFiles = JSON.parse(data);

        for(var i = 0; i < pluginFiles.length; i++) {
            var plugin = require(pluginFiles[i]).plugin;
            pluginList.push(plugin);
        }
        return {start : plugins };
    }
}

module.exports = readPlugins(null);

