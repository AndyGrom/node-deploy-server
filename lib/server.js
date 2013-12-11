/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 0:33
 */

var path = require('path');

process.chdir(path.join(__dirname, '../'));

var plugins = require('./deploy');
var appConfig = require('./applications');
var ProcessManager = require('./process-manager');
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var requestDomain = require('./request-domain');

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
        server.use(express.bodyParser());   // TODO: Replace for formidable
        server.use(passport.initialize());
        //server.use(connectDomain);

        server.get('/', function(req, res){
            res.send(200, 'server ready');
        });

        server.post('/deploy/:appName', passport.authenticate('basic', { session: false }), function(req, res){
            requestDomain(req, res, function() {
                var appName = req.params.appName;
                var app = appConfig.find(appName);
                if (app) {
                    var options = {
                        target : app.path,
                        file : req.files.file,
                        processManager : processManager,
                        moduleName : appName,
                        log : []
                    };

                    plugins.start(options, function(err, data){
                        var status = 200;
                        if (err) { status = 500; }

                        return res.send(status, data.log);
                    });
                } else {
                    res.send(404);
                }
            });
        });

        var httpServer = http.createServer(server);
        httpServer.listen(appConfig.config.port, function(){
            console.log('current dir is: ' + process.cwd());
            console.log('node deploy server launched on port: ' + httpServer.address().port);

            ['SIGHUP', 'SIGTERM', 'SIGINT'].forEach(function(item){
                process.on(item, terminate);
            });

            function terminate() {
                console.log('Terminate');
                setTimeout(function(){ process.exit(2);}, 60000);
                processManager.stopAll(function(){
                    process.exit(1);
                });
            }
        });
    });
}
