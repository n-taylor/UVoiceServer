var home = require('../app/edw/controllers/main');
var edw = require('../app/edw/controllers/edw');
var cisco = require('../app/cisco/controllers/cisco');


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
<<<<<<< HEAD
    app.post('/onCall/getMID', home.getMID);
    app.post('/onCall/getNumbers', home.getNumbers);
    app.post('/onCall/getPagers', home.getPagers);
=======

    app.post('/onCall/getMID', home.loggedIn, home.getMID);
    app.post('/onCall/getNumbers', home.loggedIn, home.getNumbers);
    app.post('/onCall/getMID', home.loggedIn, home.getMID);
>>>>>>> master

    app.post('/login', home.login);
    app.get('/logout', home.loggedIn, home.logout);

    app.get('/cisco/client/location/:macAddress', home.loggedIn, cisco.clientLocation);
    app.get('/cisco/tag/location/:macAddress', home.loggedIn, cisco.tagLocation);
}
