var os = require('os');
var path = require('path');
var fs = require('fs');
var execFile = require('child_process').execFile;
var targz = require('./targz');
var tmp = require('tmp');
var fstream = require('fstream');

function deployApp(processManager, target, file, module, callback) {

   var targetFolder = path.join(target, module.name);
   unpack(targetFolder, file, function(err){
       if (err){ return callback(err); }
       installDependencies(targetFolder, function(error, stdout){
           if (error) {
               return callback(error, stdout);
           } else {
               processManager.start(module.name, function(err){
                   callback(error, stdout);
               });
           }
       });
   });
}

function unpack(targetFolder, file, callback){
    fs.mkdir(targetFolder, function(){
        tmp.dir(function(err, tmpFolder){
            if (err){ return callback(err); }

            targz.extract(file.path, tmpFolder, function(err){
                if (err){ return callback(err); }

                fs.readdir(tmpFolder, function(err, files){
                    var writer = fstream.Writer(targetFolder);
                    fstream.Reader(path.join(tmpFolder, files[0])).pipe(writer);
                    writer.on('error', function(err){
                        callback(err);
                    })
                    writer.on('close', function(){
                        fs.unlink(file.path, function(){
                            callback(null);
                        });
                    });
                });
            });
        });
    });
}

function installDependencies(folder, callback){
    fs.exists(path.join(folder, 'package.json'), function(exists){
        if (exists) {
            var command = 'npm';
            if (/win/.test(os.platform())){
                command = "npm.cmd";
            }

            var params = ["install"];
            execFile(command, params, {cwd : folder}, function(error, stdout, stderr){
                callback(error, stdout);
            });
        } else {
            callback();
        }
    });
}

exports.deployApp = deployApp;
