var sql = require('mysql');

var state = {
    pool: null,
    mode: null
}

var PROD_DB = 'app_production_db';
var TEST_DB = 'app_test_db';

var tableName = 'users';

exports.TEST_MODE = 'test_mode';
exports.PROD_MODE = 'prod_mode';

/**
 * Connects the MySQL database. Must be called before any other functions.
 * 
 * @param {string} mode Either this.TEST_MODE or this.PROD_MODE
 * @param {*} next A function to be called afterwards
 */
exports.connect = function(mode, next) {
    var dbName = mode === this.TEST_MODE ? TEST_DB : PROD_DB;
    state.pool = sql.createPool({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '5bro=ADBNM',
        database: dbName,
        insecureAuth: true
    });

    state.mode = mode;

    // Create the table if it does not exist
    state.pool.getConnection(function(err, connection){
        if (err){
            throw err;
        }
        connection.query('CREATE TABLE IF NOT EXISTS users(id INT NOT NULL AUTO_INCREMENT, PRIMARY_KEY(id), name(VARCHAR(30))', function(err){
            if (err) throw err;
        });        
    });

    next('Connected to ' + dbName);
}

/**
 * 
 * @param {string} user 
 * @param {*} next 
 */
exports.insert = function(user, next){
    var pool = state.pool;
    if (!pool){
        throw new Error('Missing database connection...');
    }

    // Insert the new username into the table
    pool.query('INSERT INTO users (name) VALUES (?)', user, function(err){
        if (err) throw err;
    });
    
    next();
}

exports.getId = function(user, next){
    var pool = state.pool;
    if (!pool){
        throw new Error('Missing database connection...');
    }

    pool.getConnection(function(err, connection){
        if (err){
            connection.release();
            next(-1);
        }

        console.log('Connected as id ' + connection.threadId);

        connection.query('SELECT * FROM users', function(err, rows){
            connection.release();
            if (err){
                next(-1);
            }
            else {
                next(rows);
            }
        })
    });
}

