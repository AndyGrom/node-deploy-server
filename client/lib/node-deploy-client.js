var fs = require('fs');
var path = require('path');
var Client = require('./AdminModuleProxy');
var argv = require('optimist').argv;
var tmp = require('tmp');
var targz = require('./targz');
var prompt = require('prompt');
var url = require('url');

function readSettings(callback) {
    var deployFile = path.join(process.cwd(), '.deploy');
    var packagePath = path.join(process.cwd(), 'package.json');

    readDeploySettings(deployFile, function(err, hosting){
        check(err);
        fs.readFile(packagePath, function (err, data) {
            if (err) {
                return callback(err);
            }

            try {
                var package = JSON.parse(data);
                if (!package.name || package.name == '') {
                    console.log("ERROR: need specify field 'name' in package.json file");
                    process.exit(1);
                }

                if (!hosting.exclude) {
                    hosting.exclude = [];
                }
                hosting.appName = package.name;

                return callback(null, hosting);

            } catch (err) {
                return callback(err);
            }
        });
    });
}

function readDeploySettings(fileName, callback) {
    var hosting;
    fs.exists(fileName, function(exists){
        if (!exists) {
            console.log('ERROR: .deploy file not found in ' + fileName);
            process.exit(1);
        }
        fs.readFile(fileName, function(err, data) {
            if (err) {
                return callback(err);
            }

            try {
                hosting = JSON.parse(data);
            } catch(err) {
                return callback(err);
            }

            var prompts = [], i = 0;
            for(var target in hosting) {
                hosting[target].url = url.parse(hosting[target].url);

                if (argv._.indexOf(target) > -1 ){
                    return callback(null, hosting[target]);
                }

                i++;
                var uri = hosting[target].url;
                prompts.push({
                    prompt : '[' + i + '] ' + target + ': ' + uri.protocol + '//' + uri.host,
                    target: hosting[target]
                });
            }

            if (prompts.length === 0) {
                return callback('No configurations found.')
            }

            if (prompts.length === 1) {
                return callback(null, prompts[0].target);
            }

            console.log('choose target configuration number:');
            for(var i = 0; i < prompts.length; i++) {
                console.log(prompts[i].prompt);
            }

            prompt.start();
            prompt.message = '';
            prompt.delimiter = '';

            var schema = {
                properties: {
                    target: {
                        pattern: /^[0-9]+$/,
                        message: 'target must be a number',
                        required: true
                    }
                }
            };

            prompt.get(schema, function(err, result) {
                if (err) { return process.exit(1); }

                var targetIndex = result.target;
                if (targetIndex > prompts.length) {
                    return callback('Not valid configuration number');
                }

                callback(null, prompts[targetIndex-1].target);
            });
        });
    });
}


function check(err){
    if (err){
        console.log('ERROR:');
        console.log(err);
        process.exit(-1);
    }
}

readSettings(function(err, hosting){
    check(err);
    console.log('deploy to: ' + hosting.url.protocol + '//' + hosting.url.hostname + ':' + hosting.url.port);
    var admin = new Client(hosting.url);
    packAndDeploy(admin, hosting);
});

function packAndDeploy(admin, hosting){
    console.log('authenticate...');
    admin.login(function(err){
        check(err);
        hosting.exclude = hosting.exclude.concat(path.join(process.cwd(), "node_modules"));

        for(var i = 0; i < hosting.exclude.length; i++){
            hosting.exclude[i] = path.resolve(hosting.exclude[i]);
        }

        console.log('pack...');
        copyToTemporary(path.resolve('./'), hosting.exclude, function(err, path){
            check(err);
            packApplication(path, hosting.appName, function(err, fileName){
                check(err);
                console.log('deploy...');
                admin.deploy(hosting.appName, fileName, function(err, data){
                    fs.unlink(fileName);
                    check(err);
                    for (var i = 0; i < data.length; i++ ) {
                        console.log(data[i]);
                    }
                });
            });
        });
    });
}

function packApplication(folder, appName, callback){
    tmp.file(function(err, tempFile){
        targz.create(folder, tempFile, function(err){
            callback(err, tempFile);
        });
    });
}

function copyToTemporary(storagePath, exclude, callback){
    tmp.dir(function(err, path){
        check(err);
        copyFolder(storagePath, path, exclude);
        callback(null, path);
    });
}

function copyFolder(src, dst, exclude) {
    var files = fs.readdirSync(src);
    if( files && files.length ) {
        for(var i = 0; i < files.length; i++){
            var file = files[i];
            var srcFile = path.join(src, file);
            var dstFile = path.join(dst, file);
            var fileStat = fs.statSync(srcFile);
            if (fileStat.isDirectory()) {
                if (!excluded(srcFile, exclude)) {
                    fs.mkdirSync(dstFile);
                    copyFolder(srcFile, dstFile, exclude);
                }
            } else {
                if (!excluded(srcFile, exclude)) {
                    var buffer = fs.readFileSync(srcFile);
                    fs.writeFileSync(dstFile, buffer);
                }
            }
        }
    }
}

function excluded(file, exclude) {
    for(var i = 0; i < exclude.length; i++) {
        if (file === exclude[i]) {
            return true;
        }
    }
    return false;
}

