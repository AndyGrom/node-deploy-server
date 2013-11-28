/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 23:50
 */

var forever = require('forever-monitor');
var path = require('path');
var fs = require('fs');

function ProcessManager(applications){
    var applications = applications;
    var processes = {};

    function startAllProcesses(callback){

        var names = [];
        for(var app in applications.apps) {
            if (applications.apps.hasOwnProperty(app)){
                names.push(app);
            }
        }

        function next(name, callback) {
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
        var app = applications.find(name);
        if (app) {
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
    }

    function runProcess(app, name, callback){
        var rootPath =  path.join(process.cwd(), app.path, name);
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

    return {
        startAll : startAllProcesses,
        start : startProcess,
        stop : stopProcess
    }
}

module.exports = ProcessManager;