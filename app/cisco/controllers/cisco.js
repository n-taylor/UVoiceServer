var cisco = require('../models/cisco');


exports.clientLocation = function(req, res){
    var mac = req.params.macAddress.toLowerCase();
    cisco.clientLocation(req, res, mac);
}