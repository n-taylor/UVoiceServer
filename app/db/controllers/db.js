var dbDao = require('../models/dbDao');

exports.categoryLocations = function(req, res){
    var category = req.params.category;
    var building = req.params.building;
    var floor = req.params.floor;
    dbDao.sendCategoryLocations(req, res, building, floor, category);
}