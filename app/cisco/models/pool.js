var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '15McAllen17',
    database: 'app_dev_db',
    port: 3306
});

exports.pool = pool;

exports.getConnection = function(callback){
    pool.getConnection(callback);
}