var constants = require('../../../config/constants');
var request = require('request');

exports.censusByUnit = function(req, res, unit){
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
    var options = {
        uri: constants.url_bed_census_all,
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