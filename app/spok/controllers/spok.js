var request = require('request');
var constants = require('../../../config/constants');
var WebSocket = require('ws')
var net = require('net');
var xml = require('xml2js')

const on_call_not_found = 'There are no current assignments for this area';

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

client.on('error', function(err){
	console.log('Error connecting to server');
	res.writeHead(500);
	res.end('Error retrieving data');
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
