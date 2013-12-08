/**
 * Author: Andrey Gromozdov
 * Date: 04.12.13
 * Time: 0:09
 */

var path = require('path');
var fs = require('fs');
var platform = require('os').platform();
var Service;

var templateName = 'nodehosting.json';
var configSource = path.join(__dirname, '../lib/templates', templateName);

if (/win32/.test(platform)) {
    console.log('install windows service...');

    var configTarget = path.join(__dirname, '../', templateName);
    Service = require('../lib/service/windows').Service;
}

if (/linux/.test(platform)) {
    console.log('install linux daemon...');

    var configTarget = path.join('/etc', templateName);
    Service = require('../lib/service/systemv/index').Service;
}

// Create a new service object
var svc = new Service({
    name: 'nodehosting',
    description: 'The node.js deploy service',
    script: './lib/server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    console.log('service installed.');
});

installConfigTemplate = function() {
    var exists = fs.existsSync(configTarget);
    if (exists) { return; }

    var data = fs.readFileSync(configSource);
    fs.writeFileSync(configTarget, data, {mode : '0666'});
}

installConfigTemplate();
svc.install();
