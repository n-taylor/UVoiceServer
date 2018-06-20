var edw = require('../models/edwDao');

exports.censusByUnit = function (req, res){
    var unit = req.params.unit;
    var beds = edw.censusByUnit(unit);
    console.log(unit.toUpperCase() + ' census accessed: ' + beds);
    res.send(beds);
}

exports.allUnitsCensus = function(req, res){
    var beds = edw.allUnitsCensus();
    console.log('All beds accessed: ' + beds);
    res.send(beds);
}

exports.allProceduresCategories = function(req, res){
    edw.allProceduresCategories(req, res);
}