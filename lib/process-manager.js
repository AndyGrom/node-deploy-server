/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 23:50
 */

var forever = require('forever-monitor');
var path = require('path');
var fs = require('fs');
var apps = require('./applications');

function ProcessManager(){
    var applications = apps.config.applications;
    var processes = {};

    function startAllProcesses(callback){

        var names = [];
        for(var app in applications) {
            names.push(app);
        }

        function next(name, callback) {
            var app = apps.find(name);
            startProcess(name, function(){
                callback();
            });
        }

        (function iterate() {
            if (names.length > 0){
                next(names.pop(), iterate);
            } else {
                callback();
            }
        })();

    }

    function startProcess(name, callback) {
        var app = apps.find(name);
        if (app) {
            if (app.plugins && app.plugins.indexOf('startProcess') > -1){
                if (processes[name]) {
                    stopProcess(name, function(){
                        runProcess(app, name, callback);
                    });
                } else {
                    runProcess(app, name, callback);
                }
            } else {
                callback();
            }
        } else {
            callback();
        }
    }

    function runProcess(app, name, callback){
        var rootPath =  path.join(path.normalize(app.path), name);
        console.log('start application: ' + rootPath);
        var packageFile = path.join(rootPath, 'package.json');
        fs.readFile(packageFile, function(err, data) {
            if (err) { return callback && callback(err); }

            try {
                var package = JSON.parse(data);
            } catch(err) {
                return callback && callback(err);
            }

            if (package.main) {
                var startScript = path.join(rootPath, package.main);
                var child = new (forever.Monitor)(startScript, app.foreverConfig);
                child.start();
                processes[name] = child;
                return callback && callback(null);
            } else {
                return callback && callback('No start script into package.json ("main" field)');
            }
        });
    }

    function stopProcess(name, callback) {
        if (processes[name]) {
            processes[name].on('exit', function(){
                callback && callback();
            });
            processes[name].stop();
        } else {
            callback && callback();
        }
    }

    function stopAll(callback) {
        var names = [];
        for(var name in processes) {
            names.push(name);
        }

        (function iterate() {
            if (names.length > 0){
                stopProcess(names.pop(), iterate);
            } else {
                callback();
            }
        })();
    }

    return {
        startAll : startAllProcesses,
        start : startProcess,
        stopAll: stopAll,
        stop : stopProcess
    }
}

module.exports = ProcessManager;