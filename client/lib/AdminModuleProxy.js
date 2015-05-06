var http = require('http');
var fs = require('fs');
var path = require('path');

function Client(url) {
    this.url = url;
    this.credentials = {
        username : url.auth.split(':')[0],
        password : url.auth.split(':')[1]
    }

    delete url.auth;
    this.options = {
        host : url.hostname,
        port : url.port,
        headers: {
            "content-type" : 'application/json'
        }
    }
}

function response(request, res, cb){
    if (request.method == 'delete' || request.method == 'put') {
        if (res.statusCode === 200) {
            return cb(null);
        }
        return cb(res.statusCode);
    }

    var cookie = res.headers['set-cookie'];
    if (cookie) {
        cookie = cookie[0];
        this.options.headers['cookie'] = cookie;
    }

    var responseData = '';
    res.on('data', function(chunk){
        responseData += chunk.toString();
    });
    res.on('end', function(chunk){
        if (chunk) {
            responseData += chunk.toString();
        }
        if (res.statusCode === 200) {
            if (/application\/json/.test(res.headers['content-type'])){
                var result = JSON.parse(responseData);
                cb(null, result);
            } else {
                cb(null, responseData);
            }
        } else {
            if (res.statusCode === 302) {
                cb();
            } else {
                cb(res.statusCode + ' :' + responseData);
            }
        }
    });
}

Client.prototype.execute = function(data, callback){
    var self = this;
    var request = this.options;
    var cb = callback;
    if (typeof(data) == "function"){
        cb = data;
    }
    var client = http.request(request, function(res){
        response.call(self, request, res, cb);
    });

    client.on('error', function(err){
        cb && cb('500: ' + err);
    });

    if (request.method == 'post' || request.method == 'put'){
        if (request.headers['content-type'] == 'application/json') {
            client.write(JSON.stringify(data));
        } else {
            if (typeof(data) == "object"){
                var sendingData = [];
                for(var field in data) {
                    sendingData.push(encodeURIComponent(field) + '=' + encodeURIComponent(data[field]));
                }
                sendingData = sendingData.join('&');
                client.write(sendingData);
            } else {
                client.write(data);
            }
        }
    }
    client.end();
};


Client.prototype.upload = function(filePath, callback){
    var self = this;
    var request = this.options;
    var fileName = path.basename(filePath);

    var client = http.request(request, function(res){
        response.call(self, request, res, callback);
    });

    client.on('error', function(err){
        callback(err);
    });

    var boundaryKey = Math.random().toString(16); // random string
    client.setHeader('Content-Type', 'multipart/form-data; boundary="' + boundaryKey + '"');
    client.write(
        '--' + boundaryKey + '\r\n'
            + 'Content-Type: application/octet-stream\r\n'
            + 'Content-Disposition: form-data; name="file"; filename="' + fileName + '"\r\n'
            + 'Content-Transfer-Encoding: binary\r\n\r\n'
    );
    fs.createReadStream(filePath, { bufferSize: 4 * 1024 })
        .on('end', function() {
            client.end('\r\n--' + boundaryKey + '--');
        })
        .pipe(client, { end: false }) // maybe write directly to the socket here?
};

Client.prototype.login = function(callback) {
    this.options.method = 'post';
    this.options.path = '/login';

    this.execute(this.credentials, callback);
}

module.exports = Client;

Client.prototype.deploy = function(name, data, callback){
    this.options.method = 'post';
    this.options.path = '/deploy/' + name;
    this.upload(data, callback);
};

