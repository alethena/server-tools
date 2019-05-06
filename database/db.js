var mysql = require('mysql');
const config = require('./dbConfig.json');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

module.exports = {
    query: (queryText, params) => {
        return new Promise((resolve, reject) => {
            pool.query(queryText, params, (err, results, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results);
                };
            });
        })
    }
}