/**
 * Created by rishabhkhanna on 16/07/17.
 */
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;
let BearerStrategy = require('passport-http-bearer').Strategy;
let User = require('../app/models/user');
let axios = require('axios');

let confidAuth = require('./auth');


module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.key)
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id).then(project => {
            done(null, project)
        })
    });
    //================== SignUp Strategy
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
                        password: password,
                        via: 'local'
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
    // ======================= Login Strategy
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

                if (!user) {
                    return done(null, false, req.flash('loginMessage', 'No User Found'))
                }

                if (user.password !== password) {
                    return done(null, false, req.flash('loginMessage', 'oops wrong password'))
                }

                return done(null, user)
            })
        }
    ))
// ========================== Facebook Strategy
    passport.use(new FacebookStrategy({
            clientID: confidAuth.facebookAuth.clientID,
            clientSecret: confidAuth.facebookAuth.clientSecret,
            callbackURL: confidAuth.facebookAuth.callbackURL,
            profileFields: ['emails', 'displayName']
        },
        function (token, refreshToken, profile, done) {
            process.nextTick(function () {
                User.findOne({where: {id: profile.id}}).then(function (user, err) {
                    console.log(JSON.stringify(profile));
                    if (err)
                        throw err;
                    if (user) {
                        user.access_token = token;
                        return done(null, user)
                    } else {
                        //
                        const user = User.build({
                            id: profile.id,
                            access_token: token,
                            refresh_token: refreshToken,
                            name: profile.displayName,
                            email: profile.emails[0].value
                        });
                        user.save().then(function () {
                            console.log("success in saving");
                            return done(null, user)
                        }).catch(function (err) {
                            console.log(err)
                        })
                        //
                    }
                })
            })
        }
    ));

    passport.use(
        new BearerStrategy(
            function (token, done) {
                User.findOne({where: {access_token: token}})
                    .then(function (user, err) {
                        if (err)
                            throw err;
                        if (!user)
                            return done(null, false);

                        return done(null, user)
                    })
            }
        )
    )


};



