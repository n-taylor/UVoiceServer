var mysql = require('mysql');
var constants = require('../../../config/constants');
var request = require('request');
var fs = require('fs');

exports.clientLocation = function(req, res, mac){

    // Get the ID and pass
    getCredentials(function(id, pass){

        var url = 'https://' + id + ':' + pass + '@' + constants.url_client_location + mac + '.json';
        
        var options = {
            uri: url,
            method: 'GET',
            headers: req.headers,
            rejectUnauthorized: false, // DELETE THIS!!!! 
            agentOptions: {
                ca: fs.readFileSync('config/mse-parknetutahedu.crt'),
            }       
        }
    
        request(options, function(err, response){
            if (err){
                res.send(err.message);
            }
            else{
                res.headers = response.headers;
                if (!response.body.trim()){
                    response.body = 'Empty Response';
                }
                res.send(response.body);
            }
        });

    });
}

var getCredentials = function(next){
    var id = '';
    var pass = '';
    
	var connection = mysql.createConnection({
		host: 'localhost',
		user: 'root',
		password: '15McAllen17',
		database: 'app_dev_db',
		port: 3306
	})

	connection.connect();

	connection.query("SELECT * FROM sources WHERE Name = 'CISCO'", function(err, rows, fields){
		if (err){
			throw err;
		}

        id = rows[0].Identifier;
        pass = rows[0].Encoded;

        next(id, pass);
	});

	connection.end();
}