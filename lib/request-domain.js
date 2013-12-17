/**
 * Author: Andrey Gromozdov
 * Date: 12.12.13
 * Time: 0:41
 */
var domain = require('domain');

module.exports = function createDomain(req, res, processFn){
    var d = domain.create();
    d.on('error', function error(err){
        console.error('error', err.stack);
        res.send(500, 'Internal server error');
    });
    d.add(req);
    d.add(res);

    res.on('finish', function(){
        d.dispose();
    });

    d.run(processFn);
}