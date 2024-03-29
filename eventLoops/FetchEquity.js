const db = require('../database/db');
const fetchEvents = require('../web3/fetchEvents').fetchEvents;
const blockNumberToTimestamp = require('../web3/blockNumberToTimestamp').blockNumberToTimestamp;
const getLatestBlockNumber = require('../web3/getLatestBlockNumber').getLatestBlockNumber;
const ALEQABI = require('../abis/ALEQABI.json');
const async = require('async');
const stripLog = require('../helpers/stripEquityLog').stripLog;
var Raven = require('raven');
Raven.config('https://853db40d557b42189a6b178ba7428001@sentry.io/1470742').install();

async function main() {
    const sql1 = `SELECT equityAddress, equityLastBlock FROM companies WHERE equityActive = 1;`;
    try {
        const latestBlock = await getLatestBlockNumber();
        companies = await db.query(sql1, []);
        
        companies.forEach(async (company) => {
            const logs = await fetchEvents(ALEQABI, company.equityAddress, company.equityLastBlock);
            async.each(logs.filter(isEquityEvent), function (logEntry, callback) {
                stripLog(logEntry, company).then((dataToInsert) => {
                    // console.log(dataToInsert);
                    // callback;
                    db.query(sqlInsertTx, dataToInsert).then(callback);
                });
            }, () => {
                writeLastBlock(latestBlock, company.equityAddress);
                return;
            });
        });
    } catch (error) {
        Raven.captureException(error)
        return;
    }
}


function isEquityEvent(logEntry) {
    return (logEntry.event === 'Transfer' || logEntry.event === 'Mint')
}

async function writeLastBlock(latestBlock, equityAddress) {
    const sqlLastBlock = `UPDATE companies SET equityLastBlock = ? WHERE equityAddress = ?;`;
    db.query(sqlLastBlock, [latestBlock, equityAddress]).then((answ) => {
        return true
    }, (err) => {
        throw (err);
    });
}

const sqlInsertTx = `REPLACE INTO equityTransactions (txHash, event, contractAddress, timestamp, blockNumber, transactionIndex, logIndex, sender, receiver, value, shareholder, amount, message) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);`;

module.exports.fetchEquity = main;