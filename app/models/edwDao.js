var constants = require('../../config/constants');
var request = require('request');

exports.censusByUnit = function(unit){
    var lUnit = unit.toLowerCase();    
    if (lUnit == '2north'){
        return '{"2North":5}';
    }
    else if (lUnit == '5west' || lUnit == '5w'){
        return '{"5West":2}';        
    }
    else if (lUnit == 'brn' || lUnit == 'burn'){
        return '{"Burn":1}';
    }
}

exports.allUnitsCensus = function(){
    return '{ "2North":5, "5West":2, "Burn":1 }';
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