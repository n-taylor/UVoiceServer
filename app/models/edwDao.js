

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