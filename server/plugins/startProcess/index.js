/**
 * Author: Andrey Gromozdov
 * Date: 01.12.13
 * Time: 21:17
 */

function startProcess(options, done) {
    options.processManager.start(options.moduleName, function(err){
        done(null, options);
    });
}

module.exports = startProcess;