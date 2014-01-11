/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 0:33
 */

"use strict";

var path = require('path');

process.chdir(path.join(__dirname, '../'));

var appConfig = require('./applications');
var ProcessManager = require('./process-manager');
var passport = require('passport');

var controller = require('./controller');

var www = path.join(__dirname, '../www');
var staticFolder = path.join(www, 'static');
var views = path.join(www, 'views');
var fs = require('fs');
var path = require('path');
var express = require('express');

var keyFile = path.join(__dirname, '../app.key');
var certFile = path.join(__dirname, '../app.cert');

var key;
var cert;

if (fs.existsSync(keyFile)) {
    key = fs.readFileSync(keyFile);
    cert = fs.readFileSync(certFile);
}

start(appConfig);

function start(appConfig){

    var processManager = new ProcessManager(appConfig.config.apps);
    processManager.startAll(function(){

        var http = appConfig.config.ssl ? require('https') : require('http');
        var server = express();

        server.use(express.static(staticFolder));
        server.use(express.logger('dev'));
        server.use(express.bodyParser());   // TODO: Replace for formidable
        server.set('views', views);
        server.set('view engine', 'ejs');
        server.use(express.cookieParser());
        server.use(express.session({ secret: 'node deploy server' }));
        server.use(passport.initialize());
        server.use(passport.session());
        server.on('uncaughtException', function (request, response, route, error) {
            console.dir(error);
        });

        controller(server, {appConfig: appConfig, processManager: processManager});

        var httpServer;
        if (appConfig.config.ssl) {
            httpServer = http.createServer({key: key, cert: cert}, server);
        } else {
            httpServer = http.createServer(server);
        }
        httpServer.listen(appConfig.config.port, function(){
            console.log('current dir is: ' + process.cwd());
            console.log('node deploy server launched on port: ' + httpServer.address().port);

            ['SIGHUP', 'SIGTERM', 'SIGINT'].forEach(function(signal){
                process.on(signal, terminate);
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
