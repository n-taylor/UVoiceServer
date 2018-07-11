var home = require('../app/edw/controllers/main');
var edw = require('../app/edw/controllers/edw');
var cisco = require('../app/cisco/controllers/cisco');
var spok = require('../app/spok/controllers/spok');


//you can include all your controllers

module.exports = function (app) {

    app.get('/login', home.login);
    app.get('/signup', home.signup);

    app.get('/', home.loggedIn, home.home);//home
    app.get('/home', home.loggedIn, home.home);//home

    app.get('/procedures/allCategories', home.loggedIn, edw.allProceduresCategories);
    app.get('/procedures/codes', home.loggedIn, edw.getProceduresBySearchParams);
    app.get('/procedures/cost/:code', home.loggedIn, edw.getProcedureCost);

    app.get('/bedCensus', home.loggedIn, edw.allUnitsCensus);
    app.get('/bedCensus/all', home.loggedIn, edw.allUnitsCensus);
    app.get('/bedCensus/unit/:unit', home.loggedIn, edw.censusByUnit);

    app.post('/onCall/getMID', home.loggedIn, spok.getMID);
    app.post('/onCall/getNumbers', home.loggedIn, spok.getNumbers);
    app.post('/onCall/getMID', home.loggedIn, spok.getMID);
    app.post('/onCall/getPagers', home.loggedIn, spok.getPagers);

    app.post('/login', home.login);
    app.get('/logout', home.loggedIn, home.logout);

    app.get('/cisco/client/location/:macAddress', home.loggedIn, cisco.clientLocation);
    app.get('/cisco/tag/location/:macAddress', home.loggedIn, cisco.tagLocation);
}
