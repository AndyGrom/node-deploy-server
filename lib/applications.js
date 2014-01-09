/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 22:55
 */

var config = require('./configuration');

function find(name) {
    var applications = config.get().applications;
    for(var app in applications) {
        if (applications.hasOwnProperty(app)) {
            if (app === name) {
                return applications[app];
            }
        }
    }
    return null;
}

function save(data, callback) {

    config.set(data, callback);
}

module.exports = {
    config : config.get(),
    find : find,
    save : save
};



