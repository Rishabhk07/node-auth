/**
 * Created by rishabhkhanna on 15/07/17.
 */
const express = require('express');
const app = express();
const passport  = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash')
const session = require('express-session')
const sequelize = require('sequelize')

app.set('view engine','ejs')
app.use(session({secret: 'rishabhkhanna'}))
app.use(passport.initialize());
app.use(passport.session());
// app.use(bodyParser())
app.use(flash())

app.use(bodyParser.urlencoded({extended: false}))

require('./config/passport')(passport);



require('./app/routes.js')(app, passport);
app.listen("9090",()=>{
    console.log("Auth at 9090");
});
