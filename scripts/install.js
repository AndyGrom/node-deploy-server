/**
 * Author: Andrey Gromozdov
 * Date: 04.12.13
 * Time: 0:09
 */

"use strict";

var path = require('path');
var fs = require('fs');
var Service;
var platform = require('./common');

if (platform.isWin32) {
    console.log('install windows service...');
    Service = require('../lib/service/windows').Service;
}

if (platform.isLinux) {
    console.log('install linux daemon...');
    Service = require('../lib/service/systemv/index').Service;
}

if (!Service) {
    throw Error("Not supported platform: " + platform.platformName);
}

var svc = new Service({
    name: 'nodehosting',
    description: 'The node.js deploy service',
    script: './lib/server.js'
});

svc.on('install',function(){
    console.log('service installed.');
});

var installConfigTemplate = function() {
    console.log('Target configuration: ' + platform.configFile);
    var exists = fs.existsSync(platform.configFile);
    if (exists) {
        console.log('Configuration file exist. Skiping...');
        return;
    }

    console.log('Source configuration: ' + platform.configFileSource);

    var data = fs.readFileSync(platform.configFileSource);
    fs.writeFileSync(platform.configFile, data, {mode : '0666'});

    console.log('Configuration created');
};

installConfigTemplate();
svc.install();
