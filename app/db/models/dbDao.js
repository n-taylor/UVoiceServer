var pool = require('./pool');

const BAD_REQUEST = "Bad request";
const SERVER_ERROR = "There was an error processing your request";

/**
 * Gets all the recorded locations of the tags associated with the given category.
 * Results will be sent in JSON format:
 * {
 *  tagLocations: 
 *      [
 *          {
 *              mac_address: "00:00:00:00:00"
 *              category: "category"
 *              building: "building" 
 *              floor: "floor"
 *              x: 0.0
 *              y: 0.0
 *          },
 *          {...}, {...}
 *      ]
 * }
 * @param {*} req The request object
 * @param {*} res The response object
 * @param {string} category The category of tag
 */
exports.sendCategoryLocations = function(req, res, building, floor, category){
    // Make sure nothing is null
    if (!building || !floor || !category){
        res.writeHead(400);
        res.end(BAD_REQUEST);
    }
    else {
        // Get a connection with the database
        pool.getConnection(function(err, connection){
            if (err){
                res.writeHead(500);
                res.end(SERVER_ERROR);
            }
            else {
                // Now query the category
                var query = "select l.mac_address, a.category, l.building, l.floor, l.x, l.y from accruent as a, " +
                    "locations as l, tags as t where " +  `a.category = '${category}' and l.building = '${building}' ` +
                    `and l.floor = '${floor}' and t.rfid = a.rfid and l.mac_address = t.mac_address`;
                connection.query(query, function(err, rows){
                    connection.release();
                    if (err){
                        res.writeHead(500);
                        res.end(SERVER_ERROR);
                    }
                    else {
                        // Process and send the results as JSON
                        var before = {"tagLocations":rows};
                        var json = JSON.stringify(before);
                        res.send(json);
                    }
                });
            }
        });
    }
}