var mysql = require('mysql');
var constants = require('../../../config/constants');
var request = require('request');
var fs = require('fs');
var pool = require('./pool');

const EBC = 0;
const PARK = 1;

exports.clientLocation = function(req, res, mac){

    // Get the ID and pass
    getCredentials(function(error, id, pass){

        if(error){
            // If there was an error establishing a connection to the database, send a 503 service unavailable error
            res.writeHead(503);
            res.end('This service is temporarily unavailable');
        }
        else {
        // Try getting a response from the EBC campus
            getClientLocationResponse(req, EBC, mac, id, pass, function(err, response){
                // If a valid response was not obtained, try getting a response from PARK campus
                if (err || !response.body){
                    getClientLocationResponse(req, PARK, mac, id, pass, function(parkErr, parkResponse){
                        // If a valid response was not obtained, send a 400 Bad Request error
                        if (parkErr || !parkResponse.body){
                            res.writeHead(400);
                            res.end('No data was found for client ' + mac);
                        }
                        else{
                            res.send(parkResponse.body);
                        }
                    });
                }
                else {
                    res.send(response.body);
                }
            
            });
        }

    });
}

exports.tagLocation = function(req, res, mac){
    getCredentials(function(err, id, pass){
        if (err){
            res.writeHead(403);
            res.end('This service is temporarily unavailable');
        }
        else {
            getTagLocationResponse(req, EBC, mac, id, pass, function(err, response){
                if (err || !response.body){
                    getTagLocationResponse(req, PARK, mac, id, pass, function(err, response){
                        if (err || !response.body){
                            res.writeHead(400);
                            res.end('No data was found');
                        }
                        else {
                            res.send(response.body);
                        }
                    })
                }
                else {
                    res.send(response.body);
                }
            });
        }
    });
}

var getTagLocationResponse = function(req, campus, mac, id, pass, next){
    var hostName = '';
    var fileName = '';
    if (campus === EBC){
        hostName = constants.url_tag_location_ebc;
        fileName = 'config/mse-ebcnetutahedu.crt';
    }
    else if (campus === PARK){
        hostName = constants.url_tag_location_park;
        fileName = 'config/mse-parknetutahedu.crt';        
    }
    else {
        next(new Error('The campus specified is not supported'), undefined);
    }

    var url = 'https://' + id + ':' + pass + '@' + hostName + mac + '.json';
    
    var cert = fs.readFileSync(fileName);

    var options = {
        uri: url,
        method: 'GET',
        headers: req.headers,
        rejectUnauthorized: false, // DELETE THIS!!!! 
        agentOptions: {
            ca: cert,
        } 
    }

    request(options, next);
}

var getClientLocationResponse = function(req, campus, mac, id, pass, next){
    var hostName = '';
    var fileName = '';
    if (campus === EBC){
        hostName = constants.url_client_location_ebc;
        fileName = 'config/mse-ebcnetutahedu.crt';
    }
    else if (campus === PARK){
        hostName = constants.url_client_location_park;
        fileName = 'config/mse-parknetutahedu.crt';        
    }
    else {
        next(new Error('The campus specified is not supported'), undefined);
    }

    var url = 'https://' + id + ':' + pass + '@' + hostName + mac + '.json';
    
    var cert = fs.readFileSync(fileName);

    var options = {
        uri: url,
        method: 'GET',
        headers: req.headers,
        rejectUnauthorized: false, // DELETE THIS!!!! 
        agentOptions: {
            ca: cert,
        } 
    }

    request(options, next);
}

var getCredentials = function(next){
    var id = '';
    var pass = '';

    pool.getConnection(function(err, connection){
        if(err){
            // next(err, undefined, undefined); // Use in production
            next(undefined, 'ITS-Innovation-VoiceApp', 'K75wz9PBp1AaCqeNfGMKVI5R'); // Only to debug
        }
        else {
            connection.query("SELECT * FROM sources WHERE Name = 'CISCO'", function(err, rows){
                if (err){
                    connection.release();
                    next(err, undefined, undefined);
                }
                else{

                    if (!rows[0] || !rows[0].Identifier || !rows[0].Encoded){
                        connection.release();
                        next(new Error('CISCO credentials unobtained'), undefined, undefined);
                    }
                    else{        
                        id = rows[0].Identifier;
                        pass = rows[0].Encoded;

                        connection.release();
                        next(undefined, id, pass);
                    }
                }
            });            
        }
    });
}