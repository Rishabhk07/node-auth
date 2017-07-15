/**
 * Created by rishabhkhanna on 16/07/17.
 */
var LocalStrategy = require('passport-local').Strategy

var User = require('../app/models/user');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.key)
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id).then(project => {
            done(null, project)
        })
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        process.nextTick(function () {
            User.findOne({
                where: {email: email}
            }).then(function (user, err) {
                if (err)
                    return done(err);

                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That email is taken'))
                } else {
                    const user = User.build({
                        email: email,
                        password: password
                    });
                    user.save().then(function () {
                        console.log("success in saving");
                        return done(null, user)
                    }).catch(function (err) {
                        console.log(err)
                    })
                }
            })
        })
    }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            password: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            User.findOne({where: {email: email}}).then(function (user, err) {
                console.log(JSON.stringify(user));
                if (err)
                    return done(err);

                if(!user){
                    return done(null, false, req.flash('loginMessage','No User Found'))
                }

                if(user.password !== password){
                    return done(null,false, req.flash('loginMessage','oops wrong password'))
                }

                return done(null ,user)
            })
        }
    ))
};
