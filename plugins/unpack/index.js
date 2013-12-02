/**
 * Author: Andrey Gromozdov
 * Date: 01.12.13
 * Time: 21:10
 */

var fs = require('fs');
var path = require('path');

var tmp = require('tmp');
var targz = require('../../lib/targz');
var fstream = require('fstream');

function unpack(options, done){
    var targetFolder = path.join(options.target, options.moduleName);
    fs.mkdir(targetFolder, function(){
        tmp.dir(function(err, tmpFolder){
            if (err){ return done(err, options); }

            targz.extract(options.file.path, tmpFolder, function(err){
                if (err){ return done(err, options); }

                fs.readdir(tmpFolder, function(err, files){
                    var writer = fstream.Writer(targetFolder);
                    fstream.Reader(path.join(tmpFolder, files[0])).pipe(writer);
                    writer.on('error', function(err){
                        done(err, options);
                    })
                    writer.on('close', function(){
                        fs.unlink(options.file.path, function(){
                            done(null, options);
                        });
                    });
                });
            });
        });
    });
}

module.exports = unpack;