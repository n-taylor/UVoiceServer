var express = require('express');
var https = require('https');

var app = express();
var fs = require('fs');

var port = process.env.PORT || 8042;
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//set up our express application
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({
    secret: 'UVoiceAgent!',
    resave: true,
    saveUninitialized: false,
    maxAge: 3600000,
}));

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