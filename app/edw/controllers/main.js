var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var mySql = require('mysql');
var request = require('request');
var constants = require('../../../config/constants');
var WebSocket = require('ws')
var net = require('net');
var xml = require('xml2js')

const on_call_not_found = 'There are no current assignments for this area';

var cookieRegex = /(\S+)=(\S+); path=\S+; /;

var currentToken = undefined;

exports.token = () => { return currentToken; }

exports.loggedIn = function(req, res, next)
{
	// if (req.session.user) { // req.session.passport._id
		
	// 	next();

	// } else {

	// 	res.redirect('/login');

	// }

	if (req.session.auth){
		next();
	}
	else {
		res.writeHead(401);
		res.end('Access Denied');
	}
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
		headers: {'Content-Type': 'application/json'}
	};
	
	request(options, function(error, response){
		if (error){
			throw error;
		}

		var json = JSON.parse(response.body);

		if (json.authenticated === true){
			// Set the session to authorized
			if (res.req.session){
				res.req.session.auth = true;
			}

			// Set the cookie to the EDW cookie received
			var match = cookieRegex.exec(response.headers['set-cookie'][0]);
			res.headers = response.headers;
			if (match){
				currentToken = match[1] + '=' + match[2];
				require('../models/edwDao').updateCensus();
				res.cookie(match[1], match[2]);
			}
		}		
		
		res.send(response.body);
	});
}

exports.logout = function (req, res){
	var options = {
		uri: constants.url_logout,
		method: 'GET',
		headers: req.headers,
		rejectUnauthorized: false,
	}

	request(options, function(err, response){
		if (err){
			throw err;
		}

		if (req.session){
			req.session.destroy(function(err){
				if (err){
					throw err;
				}
			});
		}
		res.headers = response.headers;
		res.send(response.body);
	});
}

    
