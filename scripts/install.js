/**
 * Author: Andrey Gromozdov
 * Date: 04.12.13
 * Time: 0:09
 */

var platform = require('os').platform();
var Service;

if (/win/.test(platform)) {
    console.log('install windows service');
    Service = require('../lib/node-windows').Service;
}

if (/inux/.test(platform)) {
    console.log('install linux daemon');
    Service = require('node-linux').Service;
}


// Create a new service object
var svc = new Service({
    name: 'node-hosting',
    description: 'The node.js deploy service',
    script: './lib/server.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    process.exit(0);
});

svc.install();