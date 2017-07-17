/**
 * Created by rishabhkhanna on 15/07/17.
 */
const userAuth = require('../config/userAuth');
module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });
    app.get('/login',function (req,res) {
        res.render('login.ejs',{message: req.flash('loginMessage')})
    });
    app.get('/signup',function (req,res) {
        res.render('signup.ejs',{
            message: req.flash('singupmessage')
        })
    });

    app.post('/auth',function (req, res) {
        console.log(JSON.stringify(req.body));
        let user  = req.body;

        userAuth(user.first_name,user.last_name,user.access_token,user.user_id,function (body) {
            res.send(body)
        })
    });

    app.get('/profile',
        passport.authenticate('bearer',{session: false})
        ,function (req, res) {
        console.log(JSON.stringify(req.user));
        res.render('profile.ejs',{
            user: req.user
        })
    });

    app.post('/signup',passport.authenticate('local-signup',{
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }))

    app.post('/login',passport.authenticate('local-login',{
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }))
    // Facebook Routes
    app.get('/auth/facebook', passport.authenticate('facebook',{session: false, scope: ['email']}));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook',{
            session: false,
            failureRedirect: '/'
        }),
        function (req, res) {
            res.redirect('/profile?access_token=' + req.user.access_token);
        }
    );


    app.get('/logout',function (req,res) {
        req.logout();
        res.redirect("/")
    });



    function isLoggedIn(req, res,next) {
        if(req.isAuthenticated()){
            return next();
        }

        res.redirect('/login')
    }
};