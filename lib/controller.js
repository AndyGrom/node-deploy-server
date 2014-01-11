/**
 * Author: Andrey Gromozdov
 * Date: 02.01.14
 * Time: 15:53
 */
"use strict";

var passport = require('passport');
var args = require('optimist').argv;
var plugins = require('./deploy');
var appConfig = require('./configuration').get();
var auth = require('./auth')(checkCredentials);
var fs = require('fs');
var path = require('path');
var os = require('os');
var rimraf = require('rimraf');

function checkCredentials(auth, callback) {
    process.nextTick(function(){
        if (auth.username === appConfig.username && auth.password === appConfig.password) {
            return callback(null, {id: appConfig.username});
        } else {
            return callback('invalid username or password');
        }
    });
}

module.exports = function(app, config) {

    var appConfig = config.appConfig;
    var processManager = config.processManager;

    app.get('/login', function(req, res) {
        res.render('login', {serverName: os.hostname() || 'unknown host', args: args});
    });

    app.post('/login', auth.loginFn, function(req, res){
        res.redirect('/');
    });

    app.get('/', auth.ensureAuth, function(req, res) {
        res.render('index', {serverName: os.hostname() || 'unknown host', args: args});
    });

    app.get('/api/settings', auth.ensureAuth, function(req, res) {
        res.header('cache-control', 'no-store');
        res.send(appConfig.config);
    });

    app.get('/api/serverSettings', auth.ensureAuth, function(req, res) {
        var data = {
            port: appConfig.config.port,
            username: appConfig.config.username,
            password: appConfig.config.password,
            ssl: appConfig.config.ssl,
            defaultApplicationPath : appConfig.config.defaultApplicationPath,
            autoCreateApplication : appConfig.config.autoCreateApplication
        }
        res.header('cache-control', 'no-store');
        res.send(data);
    });

    app.post('/api/settings/:application', auth.ensureAuth, function(req, res) {
        var newConfig = req.body;
        var application = req.params.application;
        saveApplication(application, newConfig, function(err){

            var manageFn = newConfig.startProcess ? 'start' : 'stop';
            processManager[manageFn](application, function(err){
                sendPostResponse(res, err);
            });
        });

    });

    app.post('/api/serverSettings', auth.ensureAuth, function(req, res) {
        var settings = req.body;
        appConfig.config.port = settings.port;
        appConfig.config.username = settings.username;
        appConfig.config.password = settings.password;
        appConfig.config.defaultApplicationPath = settings.defaultApplicationPath;
        appConfig.config.autoCreateApplication = settings.autoCreateApplication;
        if (typeof(settings.ssl) != "undefined" && settings.ssl) {
            appConfig.config.ssl = settings.ssl;
        } else {
            delete appConfig.config.ssl
        }

        appConfig.save(appConfig.config, function(err){
            if (appConfig.config.ssl) {
                fs.writeFile(path.join(__dirname, '../app.key'), settings.key, function(err){
                    if (err) {return sendPostResponse(res, err);}
                    fs.writeFile(path.join(__dirname, '../app.cert'), settings.cert, function(err){
                        sendPostResponse(res, err);
                    });
                });
            } else {
                sendPostResponse(res, err);
            }
        });
    });

    app.del('/api/application/:application', auth.ensureAuth, function(req, res){
        var application = req.params.application;

        processManager.stop(application, function() {
            removeApp(application, function(err){
                if (!err) {
                    delete appConfig.config.applications[application];
                    appConfig.save(appConfig.config, function(err) {
                        sendPostResponse(res, err);
                    });
                } else {
                    sendPostResponse(res, err);
                }
            });
        });

    });

    app.post('/deploy/:appName', auth.ensureAuth, function(req, res){
        var appName = req.params.appName;
        var application = appConfig.find(appName);
        if (!application) {
            if (appConfig.config.autoCreateApplication) {
                var config = {
                    startProcess : true
                }
                saveApplication(appName, config, function(err){
                    if (!err) {
                        app = appConfig.find(appName);
                        deploy(appName, req.files.file, res);
                    } else {
                        sendPostResponse(res, err);
                    }
                });
            } else {
                res.send(404);
            }
        } else {
            deploy(appName, req.files.file, res);
        }
    });

    app.get('/api/status', auth.ensureAuth, function(req, res){
        processManager.status(function(status){
            res.send(status);
        });
    });

    function saveApplication(name, config, callback) {
        if (!config.foreverConfig) {
            config.foreverConfig = {};
        }
        if (!config.path) {
            config.path = appConfig.config.defaultApplicationPath
        }

        appConfig.config.applications[name] = config;
        appConfig.save(appConfig.config, function(err){
            if (!err) {
                plugins.init(name);
            }
            callback(err);
        });
    }

    function deploy(name, file, res) {
        var app = appConfig.find(name);
        var options = {
            target : app.path,
            file : file,
            processManager : processManager,
            moduleName : name,
            log : []
        };

        plugins.start(options, function(err, data){
            var status = 200;
            if (err) { status = 500; }
            return res.send(status, data.log);
        });
    }

    function removeApp(name, callback) {
        var app = appConfig.find(name);
        var targetFolder = path.join(app.path, name);
        rimraf(targetFolder, callback);
    }

    function sendPostResponse(res, err){
        if (err) {
            res.send(500, err);
        } else {
            res.send(200);
        }
    }
};

