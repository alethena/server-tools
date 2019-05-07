const db = require('../database/db');

async function resetBlocks() {
    return new Promise(async (resolve, reject) => {
        try {
            await db.query(`UPDATE companies SET SDLastBlock = 0;`, []);
            await db.query(`UPDATE companies SET equityLastBlock = 0;`, []);
            resolve("Done");
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.resetBlocks = resetBlocks;