const db = require('../database/db');
const sendMail = require('../mailer/SDNotificationMail').sendSDNotification;
const convertToCSV = require('../helpers/formatCSV').convertToCSV;

async function main() {
    const sql1 = `SELECT SDAddress, lastBlockReported FROM companies WHERE SDActive = 1`;
    await db.query(sql1, []).then((dbResponse) => {
        dbResponse.forEach(async (company) => {
            try {
                console.log(company.SDAddress, company.lastBlockReported);
                const sql2 = `SELECT * FROM SDTransactions WHERE contractAddress = ? blockNumber > ?`
                const txnsToReport = await db.query(sql2, [company.SDAddress, company.lastBlockReported]);
                const txnCSV = await convertToCSV(txnsToReport);
                // Format correctly and send out to recipients
                const sql3 = `SELECT emailAddress FROM notifications WHERE contractAddress = ?`
                const recipients = await db.query(sql3, [company.SDAddress]);

                sendMail(company.SDAddress, txnCSV, recipients);
            } catch (error) {
                console.log(error);
            }

        })

    }, (err) => {
        console.log(err);
    });
}

main();