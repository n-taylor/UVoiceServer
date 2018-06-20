var home = require('../app/controllers/main');
var edw = require('../app/controllers/edw');

//you can include all your controllers

module.exports = function (app) {

    app.get('/login', home.login);
    app.get('/signup', home.signup);

    app.get('/', home.loggedIn, home.home);//home
    app.get('/home', home.loggedIn, home.home);//home

    app.get('/procedures/allCategories', home.loggedIn, edw.allProceduresCategories);

    app.get('/bedCensus', home.loggedIn, edw.allUnitsCensus);
    app.get('/bedCensus/:unit', home.loggedIn, edw.censusByUnit);
    app.get('bedCensus/all', home.loggedIn, edw.allUnitsCensus);

    app.post('/login', home.login);


}
