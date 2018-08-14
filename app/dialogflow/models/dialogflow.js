const {google} = require('googleapis');
var https = require('https');
var pool = require('../../db/models/pool');

const QUERY_ERROR = 'There was an error interacting with the database';

const DIALOGFLOW = 'DialogFlow'
const ACCESS_TOKEN = 'access_token'

const SELECT_ACCESS_TOKEN = `SELECT token FROM credentials WHERE entity = '${DIALOGFLOW}' ` + 
    `AND identifier = '${ACCESS_TOKEN}'`;
const INSERT_ACCESS_TOKEN = `INSERT INTO credentials (entity, identifier, token) ` +
    `VALUES ('${DIALOGFLOW}', '${ACCESS_TOKEN}', '`;
const UPDATE_IF_EXISTS = ` ON DUPLICATE KEY UPDATE token = VALUES(token)`;

const TOKEN_RETRIEVAL_SUCCESS = 'The access token was successfully retrieved';

const DIALOGFLOW_QUERY_START = '{ "queryInput": { "text": { "text": ';
const DIALOGFLOW_QUERY_END = ', "languageCode: "en" } } }'


const CLIENT_ID = "73695313464-4ag6sveckevnsddajmksete18cfs6ivv.apps.googleusercontent.com";
const CLIENT_SECRET = "_avXBhN4MriGev3FVbhfKA3I";
const REDIRECT_URL = "https://localhost:8042/voice/oauthcallback";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // store the refresh_token in my database!
    console.log('Refresh: ' + tokens.refresh_token);
  }
  console.log('Access Token: ' + tokens.access_token);
});

// generate a url that asks permissions for Cloud Platform use
const scopes = [
  'https://www.googleapis.com/auth/cloud-platform'
];

exports.permissionsUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'online',

  // If you only need one scope you can pass it as a string
  scope: scopes
});

/**
 * Obtains a new access token from the OAuth2 client library
 * @param {string} code The authorization code received
 */
exports.getNewToken = async function(code){
  // This will provide an object with the access_token and refresh_token.
  // Save these somewhere safe so they can be used at a later time.
  var token = await oauth2Client.getToken(code);
  return token;
}

/**
 * Gets the current access token. Returns null if there is none stored.
 * @param {function} done Gets called with an error or the token (as a string)
 */
var getToken = function(done){
    pool.getConnection(function(err, connection){
        if (err){
            done(err);
        }
        else {
            connection.query(SELECT_ACCESS_TOKEN, function(err, rows){
                if (err){
                    done(err);
                }
                else {
                    if (rows && rows[0] && rows[0].token){
                        done(undefined, rows[0].token);
                    }    
                    else {
                        done(new Error('No access token available'));
                    } 
                }
            });
        }
    })
}


/**
 * Attemps to update or insert the given token into the database.
 * @param {string} token The access token from OAuth2
 */
exports.storeToken = async function(token, done){    
    if (!token.tokens.access_token){
        done(QUERY_ERROR);
    }
    else {
        let access = token.tokens.access_token;
        // Get a connection to the database
        pool.getConnection(function(err, connection){
            if (err){
                done(QUERY_ERROR);
            }
            else {
                // Insert or update access token
                connection.query(INSERT_ACCESS_TOKEN + access + "')" + UPDATE_IF_EXISTS, function(err, rows){
                    if (err){
                        done(QUERY_ERROR);
                    }
                    else {
                        done(undefined, TOKEN_RETRIEVAL_SUCCESS);
                    }
                });
            }
        });   
    } 
}

/**
 * Forwards the given query to DialogFlow and forwards the response received.
 * @param {string} sessionId 36 bytes or less. Recommended using req.sessionID
 * @param {string} query The query in text form.
 * @param {function(string, object)} done The callback function with the action and result parameters
 */
exports.getQueryResponse = function(sessionId, query, done){
    let post_data = JSON.stringify({
        "queryInput": {
            "text": {
                "text": query,
                "languageCode":"en"
            }
        }
    });

    let post_options = {
        host: 'dialogflow.googleapis.com',
        path: '/v2/projects/voiceagent-v2/agent/sessions/' + sessionId + ':detectIntent',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': post_data.length
        }
    };

    getToken(function(error, token){
        if (error){
            done(error);
        }
        else {
            post_options.headers['Authorization'] = 'Bearer ' + token;
            // Set up the request
            var post_req = https.request(post_options, function(res) {
                res.setEncoding('utf8');

                res.on('data', function (chunk) {
                    var result = JSON.parse(chunk);
                    if (result.error){
                        done(result.error.message);
                    }
                    else if (result.queryResult) {
                        let response = {
                            action: result.queryResult.action,
                            parameters: result.queryResult.parameters,
                            fulfillmentText: result.queryResult.fulfillmentText
                        }
                        done(undefined, response);
                    }
                    else {
                        done(new Error('Not sure how to parse the response'));
                    }
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();
        }
    });
}
