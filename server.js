/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 0:33
 */

var path = require('path');

var plugins = require('./deploy');
var appConfig = require('./applications');
var ProcessManager = require('./process-manager');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

start(appConfig);

function start(appConfig){

    passport.use(new BasicStrategy(
        function(username, password, done) {
            if (username === appConfig.config.username && password === appConfig.config.password) {
                return done(null, {username : username});
            } else {
                return done('Invalid username or password');
            }
        }
    ));

    var processManager = new ProcessManager(appConfig.config.apps);
    processManager.startAll(function(){

        var http = require('http');
        var express = require('express');
        var server = express();

        server.use(express.logger('dev'));
        server.use(express.bodyParser());
        server.use(passport.initialize());

        server.get('/', function(req, res){
            res.send(200, 'server ready');
        });

        server.post('/deploy/:appName', passport.authenticate('basic', { session: false }), function(req, res){
            var appName = req.params.appName;
            var app = appConfig.find(appName);
            if (app) {
                var options = {
                    target : app.path,
                    file : req.files.file,
                    processManager : processManager,
                    moduleName : appName,
                    log : []
                }
                plugins.start(options, function(err, data){
                    var status = 200;
                    if (err) { status = 500; }

                    return res.send(status, data.log);
                });
            } else {
                res.send(404);
            }
        });

        var httpServer = http.createServer(server);
        httpServer.listen(appConfig.config.port, function(){
            debug('node deploy server launched on port: ' + httpServer.address().port);
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


