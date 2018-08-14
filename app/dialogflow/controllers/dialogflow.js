var url = require('url');
var model = require('../models/dialogflow');
var pool = require('../../db/models/pool');

const RETRIEVE_TOKEN_ERROR = 'There was an error retrieving and storing the access token';

/**
 * Redirects the user to the page where the appropriate permissions are requested.
 * @param {*} req The https request
 * @param {*} res The https response
 */
exports.getPermissions = function(req, res){
    // Get the url 
    let permissionsUrl = model.permissionsUrl;

    // Redirect the user
    res.writeHead(301, {Location: permissionsUrl});
    res.end();
}

/**
 * After the user grants the appropriate permissions, use the authorization code included as
 * a url parameter to retrieve an access token.
 * @param {*} req 
 * @param {*} res 
 */
exports.retrieveNewToken = function(req, res){
    // Get the authorization code
    let code = url.parse(req.url, true).query;

    // Get the token (asynchronous) and store it
    model.getNewToken(code.code)
        .then((token) =>{
            console.log('Token retrieved');
            model.storeToken(token, function(error, message){
                if (error){
                    res.writeHead(500);
                    res.end(RETRIEVE_TOKEN_ERROR);
                }
                else {
                    console.log('Token stored');
                    res.writeHead(200);
                    res.end(message);
                }
            });
        })
        .catch((error) => {
            console.log(error);
            res.writeHead(500);
            res.send(RETRIEVE_TOKEN_ERROR);
        });
}
