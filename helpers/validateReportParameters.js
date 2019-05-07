const validator = require("email-validator");
const db = require('../database/db');

function validateParameters(body) {
    return new Promise(async (resolve, reject) => {
        if (body.position !== "BoardOfDirectors" && body.position !== "ExecutiveBoard") {
            reject("Invalid position");
        } else if (!validator.validate(body.emailAddress)) {
            reject("Invalid email address");
        } else if (isNaN(Number(body.tradedVolume))) {
            reject("Invalid volume");
        } else if (isNaN(Number(body.totalPrice))) {
            reject("Invalid price");
        } else if (body.reason) {
            reject("Invalid reason");
            // NEED CHECK AGAINST INJECTION HERE!!!
            // ALSO CHECK TX HASH!!!
        } else {
            const sql = `SELECT confirmed FROM reportedTrades WHERE txHash = ? AND emailAddress = ?;`
            const existing = await db.query(sql, [body.trxHash, body.emailAddress]);
            console.log(existing[0]);

            if (existing[0] === undefined) {
                resolve([body.position, body.emailAddress, Number(body.tradedVolume), Number(body.totalPrice), body.trxHash, body.Reason, 0]);
            } else if (existing[0].confirmed === 0) {
                resolve([body.position, body.emailAddress, Number(body.tradedVolume), Number(body.totalPrice), body.trxHash, body.Reason, 0]);
            } else {
                reject("Trade already reported and verified!");
            };
        }
    });
}

module.exports.validateParameters = validateParameters;