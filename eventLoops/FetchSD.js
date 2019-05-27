const db = require('../database/db');
const async = require('async');
const fetchEvents = require('../web3/fetchEvents').fetchEvents;
const getLatestBlockNumber = require('../web3/getLatestBlockNumber').getLatestBlockNumber;
const stripLog = require('../helpers/stripSDLog').stripLog;
const SDABI = require('../abis/SDABI.json');
//Queries


async function main() {
    try {
        const sql1 = `SELECT SDAddress, SDLastBlock FROM companies WHERE SDActive = 1;`;
        var latestBlock = await getLatestBlockNumber();
        var companies = await db.query(sql1, []);

        companies.forEach(async (company) => {
            const logs = await fetchEvents(SDABI, company.SDAddress, company.SDLastBlock);
            length = logs.length;
            async.each(logs.filter(isSDTransaction), function (logEntry, callback) {
                stripLog(logEntry, company).then((dataToInsert) => {
                    console.log(dataToInsert);
                    callback;
                    db.query(sqlInsertTx, dataToInsert).then(callback);
                });
            }, async () => {
                await writeLastBlock(latestBlock, company.SDAddress);
                return
            });

        });
    } catch (error) {
        console.log(error);
    }
}

async function writeLastBlock(latestBlock, SDAddress) {
    const sqlLastBlock = `UPDATE companies SET SDLastBlock = ? WHERE SDAddress = ?;`;
    db.query(sqlLastBlock, [latestBlock, SDAddress]).then((answ) => {
        return true
    }, (err) => {
        throw (err);
    });
}

const sqlInsertTx =
    `REPLACE INTO SDTransactions 
        (txHash,
        contractAddress,
        buy,
        sell,
        price,
        fee,
        lastPrice,
        user,
        amount,
        blockNumber,
        timestamp
        ) 
        VALUES(?,?,?,?,?,?,?,?,?,?,?);`;


function isSDTransaction(logEntry) {
    return (logEntry.event === 'SharesPurchased' || logEntry.event === 'SharesSold');
}

module.exports.fetchSD = main;