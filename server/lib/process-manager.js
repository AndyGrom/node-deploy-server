/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 23:50
 */

var forever = require('forever-monitor');
var path = require('path');
var fs = require('fs');
var os = require('os');
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
            if (app.startProcess){
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
        var rootPath =  path.join(path.resolve(process.cwd(), app.path), name);
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
                if (/win32/.test(os.platform())) {
                    if (typeof(app.foreverConfig.killTree) == "undefined") {
                        app.foreverConfig.killTree = false;
                    }
                    if (typeof(app.foreverConfig.command) == "undefined") {
                        app.foreverConfig.command = "node.exe"; // forever-monitor incorrect work with paths with spaces
                    }
                }
                var startScript = path.join(rootPath, package.main);
                fs.exists(startScript, function(exists){
                    if (exists) {
                        var child = new (forever.Monitor)(startScript, app.foreverConfig);
                        child.start();
                        processes[name] = child;
                        return callback && callback(null);
                    } else {
                        console.log('ERROR: Start script not found: ' + startScript);
                        return callback && callback('Start script not found: ' + startScript);
                    }
                });
            } else {
                console.log('ERROR: No start script into package.json ("main" field)');
                return callback && callback('No start script into package.json ("main" field)');
            }
        });
    }

    function stopProcess(name, callback) {
        var logEntry = 'stop  application: ' + name + '... ';
        if (processes[name]) {
            processes[name].once('exit', function(){
                delete processes[name];
                console.log(logEntry + 'OK');
                callback && callback();
            });
            processes[name].stop();
        } else {
            console.log(logEntry + 'not started');
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

    function status(callback) {
        process.nextTick(function(){
            var result = {};
            result['.'] = {
                uptime : parseInt(process.uptime(), 10) + " sec",
                memory : process.memoryUsage()
            }
            for(var app in processes) {
                result[app] = {
                    running: processes[app].running,
                    uptime: parseInt((new Date().valueOf() - processes[app].ctime)/1000,10) + ' sec'
                }
            }
            callback(result);
        });
    }

    return {
        startAll : startAllProcesses,
        start : startProcess,
        stopAll: stopAll,
        stop : stopProcess,
        status: status
    }
}

module.exports = ProcessManager;