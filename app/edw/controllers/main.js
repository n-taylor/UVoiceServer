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

exports.getMID = function (req, res){

	var obj = { code: req.body.code};

    var code = obj.code



    var client = new net.Socket();

client.connect(9720, '155.100.69.40', function() {
	console.log('Connected');
	client.write('<?xml version="1.0" encoding="utf-8"?>'+ 
	'<procedureCall name="GetGroupsCurrAssignXml" xmlns="http://xml.amcomsoft.com/api/request">'+  
	'<parameter name="ocmid" null="false">'+code+'</parameter>'+   
	'<parameter name="tz" null="true"></parameter>'+ 
	'</procedureCall>' 
	);
});

client.on('data', function(data) {
	console.log('Received: ' + data);

	var parseString= xml.parseString;

	var responceObject = new Object;

	var key = 0;

	parseString(data, function(err, result){


		if  (result.procedureResult.success[0].parameter[0]._ != "-1"){
		result.procedureResult.success[0].parameter[1].getGroupsCurrentAssignments[0].assignment.forEach(assign => {
			responceObj = {mid: assign.mid[0], name: assign.name[0]};
		
			responceObject[key]=responceObj;
			key++;

		});
	}
	
	})


	res.send(responceObject);

// kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

}


exports.getNumbers = function (req, res){

	var obj = { code: req.body.code};

	var code = obj.code

	 var client = new net.Socket();

client.connect(9720, '155.100.69.40', function() {
	console.log('Connected');
	client.write('<?xml version="1.0" encoding="utf-8"?>'+ 
	'<procedureCall name="GetPhoneNumber" xmlns="http://xml.amcomsoft.com/api/request">'+
	'<parameter name="mid" null="false">'+code+'</parameter>'+ 
	'<parameter name="phone_number_type" null="true"></parameter>'+ 
	'</procedureCall>'
	);
});

client.on('data', function(data) {
	console.log('Received: ' + data);

	var parseString= xml.parseString;

	var responceObject = new Object;

	parseString(data, function(err, result){
		if (err){
			res.writeHead(500);
			res.end('There was an issue processing your request');
		}
		else {
			var code = result.procedureResult.success[0].parameter[2]._;
			if(code == '0'){
				// Successful retrieval
				responceObject = { numbers: result.procedureResult.success[0].parameter[1]._}
				res.send(responceObject);
			}
			else if (code == '-1'){
				res.writeHead(404);
				res.end(on_call_not_found);
			}
		}
	})

// kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

}

exports.getPagers = function (req, res){

	var obj = { code: req.body.code};

	var code = obj.code

	 var client = new net.Socket();

client.connect(9720, '155.100.69.40', function() {
	console.log('Connected');
	client.write('<?xml version="1.0" encoding="utf-8"?>'+ 
	'<procedureCall name="GetPagerId" xmlns="http://xml.amcomsoft.com/api/request">'+
	'<parameter name="mid" null="false">'+code+'</parameter>'+   
    '</procedureCall>'
	);
});

client.on('data', function(data) {
	console.log('Received: ' + data);

	var parseString= xml.parseString;

	var responceObject = new Object;

	parseString(data, function(err, result){

			responceObject = { numbers: result.procedureResult.success[0].parameter[1]._}
	
	})


	res.send(responceObject);

// kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

}


    
