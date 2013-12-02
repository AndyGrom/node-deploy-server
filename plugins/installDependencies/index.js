/**
 * Author: Andrey Gromozdov
 * Date: 01.12.13
 * Time: 21:17
 */

var os = require('os');
var fs = require('fs');
var path = require('path');
var execFile = require('child_process').execFile;

function installDependencies(options, done){
    var targetFolder = path.join(options.target, options.moduleName);
    fs.exists(path.join(targetFolder, 'package.json'), function(exists){
        if (exists) {
            var command = 'npm';
            if (/win/.test(os.platform())){
                command = "npm.cmd";
            }

            var params = ["install"];
            execFile(command, params, {cwd : targetFolder}, function(error, stdout, stderr){
                options.log.push(stdout);
                done(error, options);
            });
        } else {
            done(null, options);
        }
    });
}

module.exports = installDependencies;