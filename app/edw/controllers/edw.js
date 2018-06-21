var edw = require('../models/edwDao');

exports.censusByUnit = function (req, res){
    var unit = req.params.unit.toUpperCase();
    edw.censusByUnit(req, res, unit);
}

exports.allUnitsCensus = function(req, res){
    edw.allUnitsCensus(req, res);
}

exports.allProceduresCategories = function(req, res){
    edw.allProceduresCategories(req, res);
}

exports.getProceduresBySearchParams = function(req, res){
    edw.getProceduresBySearchParams(req, res);
}

exports.getProcedureCost = function(req, res){
    var code = req.params.code;
    edw.getProcedureCost(req, res, code);
}