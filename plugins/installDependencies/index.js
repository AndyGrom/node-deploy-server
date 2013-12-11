/**
 * Author: Andrey Gromozdov
 * Date: 01.12.13
 * Time: 21:17
 */

var os = require('os');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var nodePath = path.dirname(process.execPath);
var npmPath;
if (os.platform() === 'win32') {
    npmPath = path.join(nodePath, 'npm.cmd');
}
if (os.platform() === 'linux') {
    npmPath = path.join(nodePath, 'npm');
}

function installDependencies(options, done){
    var targetFolder = path.join(options.target, options.moduleName);
    fs.exists(path.join(targetFolder, 'package.json'), function(exists){
        if (exists) {

            var command = npmPath;

            var params = ["install"];
            var buffer = '';
            var stderr = '';
            var child = spawn(command, params, {cwd : targetFolder});

            child.stdout.on('data', function(data){
                buffer += data;
            });
            child.stderr.on('data', function(data){
                buffer += data;
                stderr += data;
            });

            child.addListener('close', function exitHandler(code, signal){
                if (code === 0 && signal === null) {
                    options.log.push(buffer);
                    done(null, options);
                } else {
                    done(stderr, options);
                }
            });
            child.addListener('error', function(err){
                child.stdout.destroy();
                child.stderr.destroy();
                done(err, options);
            });

        } else {
            done(null, options);
        }
    });
}

module.exports = installDependencies;