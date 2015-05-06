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
var mkdirp = require('mkdirp');

function unpack(options, done){
    var targetFolder = path.join(options.target, options.moduleName);
    mkdirp(targetFolder, function(err){
        if (err) {
            return done(err, options);
        }

        tmp.dir(function(err, tmpFolder){
            if (err){ return done(err, options); }

            targz.extract(options.file.path, tmpFolder, function(err){
                if (err){ return done(err, options); }

                fs.readdir(tmpFolder, function(err, files){
                    if (err) { return done(err, options); }

                    var writer = fstream.Writer(targetFolder);
                    fstream.Reader(path.join(tmpFolder, files[0])).pipe(writer);
                    writer.on('error', function(err){
                        done(err, options);
                    })
                    writer.on('close', function(){
                        fs.unlink(options.file.path, function(err){
                            done(err, options);
                        });
                    });
                });
            });
        });
    });
}

module.exports = unpack;