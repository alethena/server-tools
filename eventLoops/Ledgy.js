const db = require('../database/db');
const fs = require('fs');

const outputPath = 'logFiles/log';

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
                            "value": logItem.value,
                            "timestamp": new Date(logItem.timestamp).getTime()/1000
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
                            "amount": logItem.amount,
                            "message": logItem.message,
                            "timestamp": new Date(logItem.timestamp).getTime()/1000
                        });
                    }
                });
                fs.writeFileSync(outputPath + company.tokenSymbol + '.json', JSON.stringify(outputFile));
                // console.log(outputFile);
            });
            return;
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports.generateLedgyLog = generateLedgyLog;
