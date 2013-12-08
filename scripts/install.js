/**
 * Author: Andrey Gromozdov
 * Date: 04.12.13
 * Time: 0:09
 */

var platform = require('os').platform();
var Service;


if (/win32/.test(platform)) {
    console.log('install windows service...');
    Service = require('../lib/service/windows').Service;
}

if (/linux/.test(platform)) {
    console.log('install linux daemon...');
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

svc.install();