/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 0:33
 */

var path = require('path');

var deploy = require('./deploy');
var appConfig = require('./applications');
var ProcessManager = require('./process-manager');

appConfig.init(function(err, config) {
    if (err) { return debug(err); }
    start(config);
});

function start(config){
    var processManager = new ProcessManager(config.applications);
    processManager.startAll(function(){

        var http = require('http');
        var express = require('express');
        var server = express();

        server.use(express.logger('dev'));
        server.use(express.static(path.join(__dirname, 'static')));
        server.use(express.bodyParser());

        server.post('/deploy/:appName', function(req, res){
            var appName = req.params.appName;
            var found = false;
            for(var app in config.applications) {
                if (app === appName) {
                    found = true;
                    var file = req.files.file;
                    var target = config.applications[app].path;
                    var module = {
                        name : appName
                    }
                    deploy.deployApp(processManager, target, file, module, function(err, data){
                        if (err) {
                            res.send(500, err.toString());
                            return;
                        }
                        res.send(data);
                        return;
                    });
                    break;
                }
            }
            if (!found) {
                res.send(404);
            }
        });

        var httpServer = http.createServer(server);
        httpServer.listen(config.port, function(){
            debug('node deploy server lunched on: ' + httpServer.address().port);
        });
    });
}

function debug(data) {
    if (typeof(data) === "object"){
        console.dir(data);
        return;
    }
    console.log(data);
}


