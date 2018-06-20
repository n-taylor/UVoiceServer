var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var request = require('request');
var constants = require('../../config/constants');
var sql = require('../models/sql');

exports.loggedIn = function(req, res, next)
{
	// if (req.session.user) { // req.session.passport._id
		
	// 	next();

	// } else {

	// 	res.redirect('/login');

	// }

	next();
}

exports.home = function(req, res) {
	
	
	res.render('home.ejs', {
		error : req.flash("error"),
		success: req.flash("success"),
		session:req.session,
	
	 });
	 
}


exports.signup = function(req, res) {

	if (req.session.user) {

		res.redirect('/home');

	} else {

		res.render('signup', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
	}

}


exports.login = function(req, res) {

	var obj = { username: req.body.username, password: req.body.password };


	var options = {
		uri: constants.url_login,
		body: JSON.stringify(obj),
		method: 'POST',
		headers: { 'Content-Type':'application/json'}
	};
	
	request(options, function(error, response){
		res.headers = response.headers;
		res.send(response.body);
	});

	// For testing purposes, insert into the database
	sql.connect(sql.TEST_MODE, function(message){
		console.log(message);
	});

	// sql.insert(obj.username, function(){
	// 	console.log('Inserted ' + obj.username + ' into the db');
	// });

	// sql.getId('u0971108', function(rows){
	// 	console.log('Rows obtained: ' + rows);
	// });
}


    
