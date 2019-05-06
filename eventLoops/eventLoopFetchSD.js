const db = require('../database/db');
const async = require('async');
const fetchEvents = require('../web3/fetchEvents').fetchEvents;
const getLatestBlockNumber = require('../web3/getLatestBlockNumber').getLatestBlockNumber;
const stripLog = require('../helpers/stripSDLog').stripLog;
const SDABI = require('../abis/SDABI.json');
//Queries


async function main() {
    // Get latest block and relevant companies
    const sql1 = `SELECT SDAddress, SDLastBlock FROM companies WHERE SDActive = 1;`;
    try {
        const latestBlock = await getLatestBlockNumber();
        const dbResponse = await db.query(sql1, []);
    } catch (error) {
        console.log(error);
    }

    // Fetch log for all companies and save to DB
    dbResponse.forEach(async (company) => {
        try {
            const logs = await fetchEvents(SDABI, company.SDAddress, company.SDLastBlock);
            length = logs.length;

            async.d

            logs.filter(isSDTransaction).forEach(async (logEntry) => {
                const dataToInsert = await stripLog(logEntry, company);
                db.query(sqlInsertTx, dataToInsert).then(() => {
                    length--;
                    if (length === 0) {
                        const sqlLastBlock = `UPDATE companies SET SDLastBlock = ? WHERE SDAddress = ?;`
                        db.query(sqlLastBlock, [latestBlock, company.SDAddress]).then((answ) => {}, (err) => {
                            console.log(err)
                        });
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    });
}
const sqlInsertTx =
                    `REPLACE INTO SDTransactions 
                    (txHash, contractAddress, buy, sell, price, fee, lastPrice, user, amount, blockNumber, timestamp) 
                    VALUES(?,?,?,?,?,?,?,?,?,?,?);`;


function isSDTransaction(logEntry) {
    return (logEntry.event === 'SharesPurchased' || logEntry.event === 'SharesSold');
}

module.exports.fetchSD = main;