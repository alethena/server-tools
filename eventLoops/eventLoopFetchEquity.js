const db = require('../database/db');
const fetchEvents = require('../web3/fetchEvents').fetchEvents;
const blockNumberToTimestamp = require('../web3/blockNumberToTimestamp').blockNumberToTimestamp;
const getLatestBlockNumber = require('../web3/getLatestBlockNumber').getLatestBlockNumber;
const ALEQABI = require('../abis/ALEQABI.json');
const async = require('async');
const stripLog = require('../helpers/stripEquityLog').stripLog;

async function main() {
    const sql1 = `SELECT equityAddress, equityLastBlock FROM companies WHERE equityActive = 1`;
    try {
        const latestBlock = await getLatestBlockNumber();
        companies = await db.query(sql1, []);
        
        companies.forEach(async (company) => {
            const logs = await fetchEvents(ALEQABI, company.equityAddress, company.equityLastBlock);
            async.each(logs.filter(isEquityTransfer), function (logEntry, callback) {
                stripLog(logEntry, company).then((dataToInsert) => {
                    db.query(sqlInsertTx, dataToInsert).then(callback);
                });
            }, () => {
                writeLastBlock(latestBlock, company.equityAddress);
            });
        });
    } catch (error) {
        console.log(error);
    }
}


function isEquityTransfer(logEntry) {
    return (logEntry.event === 'Transfer')
}

async function writeLastBlock(latestBlock, equityAddress) {
    const sqlLastBlock = `UPDATE companies SET equityLastBlock = ? WHERE equityAddress = ?;`
    db.query(sqlLastBlock, [latestBlock, equityAddress]).then((answ) => {
        return true
    }, (err) => {
        throw (err);
    });
}

const sqlInsertTx = `REPLACE INTO equityTransactions (txHash, contractAddress, sender, receiver, blockNumber, timestamp, amount) VALUES(?,?,?,?,?,?,?)`;

module.exports.fetchEquity = main;