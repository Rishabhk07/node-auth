/**
 * Created by rishabhkhanna on 15/07/17.
 */
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

    app.get('/profile',function (req, res) {
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

    app.get('/logout',function (req,res) {
        req.logout();
        res.redirect("/")
    });

    function isLoggedIn(req, res,next) {
        if(req.isAuthenticated()){
            return next();
        }

        res.redirect('/')
    }
};