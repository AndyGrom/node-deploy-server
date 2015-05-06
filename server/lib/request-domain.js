/**
 * Author: Andrey Gromozdov
 * Date: 12.12.13
 * Time: 0:41
 */

"use strict";
var domain = require('domain');

module.exports = function createDomain(req, res, processFn){
    var d = domain.create();
    d.on('error', function error(err){
        console.error('error', err.stack);
        res.send(500, 'Internal server error');
        d.dispose();
    });
    d.add(req);
    d.add(res);

    res.once('finish', function(){
        d.dispose();
    });
    res.once('close', function(){
        d.dispose();
    });

    process.nextTick(function(){
        d.run(processFn);
    });
};