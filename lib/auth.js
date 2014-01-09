/**
 * Author: Andrey Gromozdov
 * Date: 04.01.14
 * Time: 17:00
 */


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var loginFn = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
});

function ensureAuth(req, res, next) {
    var isAuth = req.isAuthenticated();
    if (isAuth) {
        return next();
    }

    if (req.method === 'GET' && req.route.path === '/') {
        return res.redirect('login');
    }
    return res.send(401, 'Unauthorized');
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    process.nextTick(function(){
        done(null, {id: id});
    });
});


module.exports = function(checkAuthFn) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            checkAuthFn({username: username, password: password}, function(err, user){
                if (err) {
                    return done(null, false, { message: err });
                }
                return done(null, user);
            });
        }
    ));
    return {
        passport : passport,
        loginFn : loginFn,
        ensureAuth : ensureAuth
    }
}