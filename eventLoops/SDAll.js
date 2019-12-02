const db = require('../database/db');
const fs = require('fs');
const path = require('path');
const outputPath = '../public/log';
var Raven = require('raven');
Raven.config('https://853db40d557b42189a6b178ba7428001@sentry.io/1470742').install();

async function generateSDAll() {
    const sql1 = `SELECT SDAddress, tokenSymbol FROM companies WHERE SDActive = 1;`;
    companies = await db.query(sql1, []);
    //console.log(companies);
    companies.forEach(async (company) => {
	//console.log(company.SDAddress);
        let outputFile = [];
        const sql2 = `SELECT * FROM SDTransactions WHERE contractAddress = ? ORDER BY timestamp DESC;`;
        db.query(sql2, [company.SDAddress]).then((log) => {
            log.forEach((logItem) => {
                outputFile.push({
                    "timestamp": new Date(logItem.timestamp).getTime(),
                    "type": (logItem.buy === 0) ? "Verkauf" : "Kauf",
                    "amount": logItem.amount,
                    "price": Math.floor(logItem.price/10**16)/100,
                    "insider": "Nein"
                })
        fs.writeFileSync(path.join(__dirname, '../public/' + company.tokenSymbol + '_SD.json'), JSON.stringify(outputFile));

            });
        });
        //fs.writeFileSync(path.join(__dirname, '../public/' + company.tokenSymbol + '_SD.json'), JSON.stringify(outputFile));
    })
}

module.exports.generateSDAll = generateSDAll;
