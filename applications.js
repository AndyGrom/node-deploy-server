/**
 * Author: Andrey Gromozdov
 * Date: 27.11.13
 * Time: 22:55
 */

var path = require('path');
var fs = require('fs');
var config = require('./configuration');

function find(name) {
    var applications = this.config.applications;
    for(var app in applications) {
        if (applications.hasOwnProperty(app)) {
            if (app === name) {
                return applications[app];
            }
        }
    }
    return null;
}

module.exports = {
    config : config,
    find : find
};



