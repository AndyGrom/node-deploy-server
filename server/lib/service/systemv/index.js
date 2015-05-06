/**
 * Author: Andrey Gromozdov
 * Date: 08.12.13
 * Time: 12:54
 */

var path = require('path');
var fs = require('fs');
var ejs = require('ejs');
var EventEmitter = require('events').EventEmitter;
var nodePath = path.dirname(process.execPath);

var initdPath = path.join('/etc', 'init.d');

exports.Service = Service = function(options) {
    this.options = options;
};

Service.prototype = new EventEmitter();

Service.prototype.install = function(){
    var self = this;
    var script, target;
    var scriptName = path.join(__dirname, 'nodehosting');
    var initdScript = path.join(initdPath, 'nodehosting');
    var appDir = path.resolve(__dirname,  '../../../');
    var ejsOptions = {
        nodeExec: path.join(nodePath, 'node'),
        name: self.options.name,
        nodeApplication : path.join(appDir, self.options.script),
        appDir : appDir,
        description: self.options.description
    };

    console.log('copy start script: "' + scriptName + '" to "' + initdScript + '"');

    ejs.renderFile(scriptName, ejsOptions, function(err, data){
        if (err){
            throw new Error(err);
        }
        fs.writeFile(initdScript, data, {mode: 0755}, function(err){
            if (err) {
                throw new Error(err);
            }
            self.emit('install');
        });
    });
};