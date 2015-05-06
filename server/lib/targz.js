var fstream = require('fstream');
var tar = require('tar');
var zlib = require('zlib');
var fs = require("fs");

function createTarGz(sourceDir, fileName, callback){
    var reader = fstream.Reader({ 'path': sourceDir, 'type': 'Directory' });
    var writer = fstream.Writer({ 'path': fileName });
    var pack = tar.Pack();
    var zip = zlib.Gzip();

    reader.pipe(pack).pipe(zip).pipe(writer);

    writer.on('close', function(){
        callback();
    });

    writer.on('error', function(err){
        callback(err);
    });
}

function extractTarGz(fileName, destination, callback){
    var reader = fs.createReadStream(fileName);
    var gunzip = zlib.Gunzip();
    var extract = tar.Extract({ path: destination });

    reader.pipe(gunzip).pipe(extract);

    extract.on("error", function (err) {
        callback(err);
    });

    extract.on("end", function () {
        callback();
    });
}

module.exports = {
    create: createTarGz,
    extract: extractTarGz
};
