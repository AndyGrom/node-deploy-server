/**
 * Author: Andrey Gromozdov
 * Date: 10.01.14
 * Time: 22:10
 */

var platform = require('os').platform();
var path = require('path');

var platforms = {
    win32 : 'win32',
    linux : 'linux',
    unknown: 'unknown'
}

var templateName = 'nodehosting.json';
var nodePath = path.dirname(process.execPath);

var result = {
    isWin32 : /win32/.test(platform),
    isLinux : /linux/.test(platform),
    platformName : platform,
    configFileSource : path.join(__dirname, '../lib/templates', templateName) + '.template'
};

if (result.isWin32) {
    result.configFile = path.join(__dirname, '../', templateName);
    result.nodeExec = 'node.exe';
}

if (result.isLinux) {
    result.platform = platforms.linux;
    result.configFile = path.join('/etc', templateName);
    result.nodeExec = path.join(nodePath, 'node');
}

module.exports = result;

