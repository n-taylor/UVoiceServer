var constants = require('../../../config/constants');
var request = require('request');
var main = require('../../edw/controllers/main');

const updateInterval = 60000;

var census = [];

exports.updateCensus = function(){
    update();
}

var update = function() {
    if (main.token() !== undefined){
        var options = {
            uri: constants.url_bed_census_all,
            method: 'GET',
            headers: {'cookie': main.token()},
            rejectUnauthorized: false, // DELETE THIS!!!!
        }

        request(options, function(err, response){
            if(err){
                console.log('Error retrieving current census');
            }
            else if (response.body != 'Access Denied') {
                census = [];
                var json = JSON.parse(response.body);
                for(var i = 0, len = json.length; i < len; i++){
                    var obj = {};
                    obj['unit'] = json[i]['unit'];
                    obj['available'] = json[i]['available'];
                    census.push(obj);
                }
            }
        });
    }
}

setInterval(update, updateInterval);

/**
 * If the given unit has a number of available beds recorded in census, sends the info through res.
 * Otherwise, sends a request to EDW for the given unit and sends the response through res.
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {string} unit 
 */
exports.censusByUnit = function(req, res, unit){
    if (census.length === 0){
        update();
    }

    var obj = {};
    for(var i = 0, len = census.length; i < len; i++){
        if(census[i]['unit'] == unit.toUpperCase()){
            obj['unit'] = unit;
            obj['available'] = census[i]['available'];
            res.send(JSON.stringify([obj]));
            return;
        }
    }
    var options = {
        uri: constants.url_bed_census_unit + "/" + unit,
        method: 'GET',
        headers: req.headers,
        rejectUnauthorized: false, // DELETE THIS!!!!        
    }

    request(options, function(err, response){
        if (err){
            res.send(err.message);
        }
        else{
            res.headers = response.headers;
            res.send(response.body);
        }
    })
}

exports.allUnitsCensus = function(req, res){
    if (census.length === 0){
        update();
    }

    var json = JSON.stringify(census);
    res.send(json);
    // var options = {
    //     uri: constants.url_bed_census_all,
    //     method: 'GET',
    //     headers: req.headers,
    //     rejectUnauthorized: false, // DELETE THIS!!!!        
    // }

    // request(options, function(err, response){
    //     if (err){
    //         res.send(err.message);
    //     }
    //     else{
    //         res.headers = response.headers;
    //         var json = JSON.stringify(census);
    //         res.send(response.body);
    //         // res.send(json);
    //     }
    // })
}

exports.allProceduresCategories = function(req, res){
    var options = {
        uri: constants.url_procedures_all_categories,
        method: 'GET',
        headers: req.headers,
        rejectUnauthorized: false, // DELETE THIS!!!!        
    }

    request(options, function(err, response){
        if (err){
            res.send(err.message);
        }
        else{
            res.headers = response.headers;
            res.send(response.body);
        }
    });
}

exports.getProceduresBySearchParams = function(req, res){
    var params = req.query;

    var path = '';
    if (params.category){
        path += "/" + params.category;
        if (params.subCategory){
            path += "/" + params.subCategory;
            if (params.extremity){
                path += "/" + params.extremity;
            }
        }
    }

    var options = {
        uri: constants.url_procedures_codes_by_hierarchy + path,
        method: 'GET',
        headers: req.headers,
        rejectUnauthorized: false, // DELETE THIS!!!!
    }

    request(options, function(err, response){
        if (err){
            res.send
        }
        else {
            res.headers = response.headers;
            res.send(response.body);
        }
    });
}

exports.getProcedureCost = function(req, res, code){
    var options = {
        uri: constants.url_procedures_cost + "/" + code,
        method: 'GET',
        headers: req.headers,
        rejectUnauthorized: false, // DELETE THIS!!!!        
    }

    request(options, function(err, response){
        if (err){
            res.send(err.message);
        }
        else{
            res.headers = response.headers;
            res.send(response.body);
        }
    });
}