var debug = require('debug')('webfood:connection');
var mongodb = require('mongodb').MongoClient;

var db;

debug('Connecting to database...');

/**
 * Establish a database connection to mongodb.
 *
 * Usage:
 *
 * 		require('./connection')(function(err, db) { use the db here   })
 * 
 * @param  {Function} cb(err, database) Callback function that passes an
 *     error (if present) and the database connection. 
 */
module.exports = function (cb) {
	if (!db) {
		mongodb.connect('mongodb://webfoods:webfoods@ds053380.mongolab.com:53380/webfood2', function(err, result) {
			if (err) {
				debug('error: ', err);
				cb(err);
			}
			else {
				debug('Connection established');
				db = result;
				cb(null, db);
			}
		});
	}
	else {
		process.nextTick(function () {
			cb(null, db);
		});
	}
};
