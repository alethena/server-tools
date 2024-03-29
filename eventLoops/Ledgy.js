const db = require('../database/db');
const fs = require('fs');
const path = require('path');
const outputPath = '../public/log';
var Raven = require('raven');
Raven.config('https://853db40d557b42189a6b178ba7428001@sentry.io/1470742').install();

async function generateLedgyLog() {
    const sql1 = `SELECT equityAddress, tokenSymbol FROM companies WHERE equityActive = 1;`;
    try {
        companies = await db.query(sql1, []);

        companies.forEach(async (company) => {
            let outputFile = [];
            const sql2 = `SELECT * FROM equityTransactions WHERE contractAddress = ? ORDER BY timestamp ASC;`;
            db.query(sql2, [company.equityAddress]).then((log) => {
                log.forEach((logItem) => {
                    if (logItem.event === 'Transfer' && logItem.value != 0) {
                        outputFile.push({
                            "address": logItem.contractAddress,
                            "blockNumber": logItem.blockNumber,
                            "transactionHash": logItem.txHash,
                            "transactionIndex": logItem.transactionIndex,
                            "logIndex": logItem.logIndex,
                            "event": "Transfer",
                            "from": logItem.sender,
                            "to": logItem.receiver,
                            "value": logItem.value.toString(),
                            "timestamp": new Date(logItem.timestamp).getTime() / 1000
                        });
                    } else if (logItem.event === 'Mint') {
                        outputFile.push({
                            "address": logItem.contractAddress,
                            "blockNumber": logItem.blockNumber,
                            "transactionHash": logItem.txHash,
                            "transactionIndex": logItem.transactionIndex,
                            "logIndex": logItem.logIndex,
                            "event": "Mint",
                            "shareholder": logItem.shareholder,
                            "amount": logItem.amount.toString(),
                            "message": logItem.message,
                            "timestamp": new Date(logItem.timestamp).getTime() / 1000
                        });
                    }
                });
                fs.writeFileSync(path.join(__dirname, '../public/' + company.tokenSymbol + '.json'), JSON.stringify(outputFile))
                // fs.writeFileSync(outputPath + company.tokenSymbol + '.json', JSON.stringify(outputFile));
                // console.log(outputFile);
            });
            return;
        });
    } catch (error) {
        Raven.captureException(error);
    }
}

module.exports.generateLedgyLog = generateLedgyLog;