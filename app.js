var express = require('express');
var https = require('https');

var app = express();
var multer = require('multer')
var constants = require('constants');
var constant = require('./config/constants');
var fs = require('fs');

var port = process.env.PORT || 8042;
var mongoose = require('mongoose');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var now = new Date();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
// mongoose.connect(configDB.url); // connect to our database

//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'ejs'); // set up ejs for templating

app.use(flash()); // use connect-flash for flash messages

// routes ======================================================================
require('./config/routes.js')(app); // load our routes and pass in our app

// user certs ==================================================================
var options = {
    key: fs.readFileSync('./config/rootCA.key'),
    cert: fs.readFileSync('./config/emulator.crt')
}

//launch =======================================================================
var server = https.createServer(options, app).listen(port, () => {
    console.log('The magic happens securely on port ' + port);
});
// app.listen(port);
// console.log('The magic happens on port ' + port);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render('404', {title: "Sorry, page not found"});
});

app.use(function (req, res, next) {
    res.status(500).render('404', {title: "Sorry, page not found"});
});
exports = module.exports = app;