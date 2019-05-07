var db = require('./database/db');

async function main() {
    try {
        res = await db.query('SELECT * FROM trade');
        console.log(res);
    } catch (error) {
        console.log("ERROR", error.errno);
    }

}

main();