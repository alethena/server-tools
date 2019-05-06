const db = require('../database/db');
const fetchEvents = require('../web3/fetchEvents').fetchEvents;
const blockNumberToTimestamp = require('../web3/blockNumberToTimestamp').blockNumberToTimestamp;
const getLatestBlockNumber = require('../web3/getLatestBlockNumber').getLatestBlockNumber;
const ALEQABI = require('../abis/ALEQABI.json');
const SDABI = require('../abis/SDABI.json');
//Queries


async function main() {
    //Equity queries
    const sql1 = `SELECT equityAddress, equityLastBlock FROM companies WHERE equityActive = 1`;
    const latestBlock = await getLatestBlockNumber();

    await db.query(sql1, []).then((dbResponse) => {
        dbResponse.forEach(async (company) => {
            try {
                const logs = await fetchEvents(ALEQABI, company.equityAddress, company.equityLastBlock);
                logs.filter(isEquityTransfer).forEach(async (logEntry) => {
                    const timestamp = await blockNumberToTimestamp(logEntry.blockNumber);
                    const sqlInsertTx = `REPLACE INTO equityTransactions (txHash, contractAddress, sender, receiver, blockNumber, timestamp, amount) VALUES(?,?,?,?,?,?,?)`;

                    await db.query(sqlInsertTx,
                        [
                            logEntry.transactionHash,
                            company.equityAddress,
                            logEntry.returnValues.from,
                            logEntry.returnValues.to,
                            logEntry.blockNumber,
                            timestamp,
                            logEntry.returnValues.value
                        ]);
                })
            } catch (error) {
                console.log(error);
            }
        })

    }, (err) => {
        console.log(err);
    });

    // //SD queries
    // const sql2 = `SELECT SDAddress, SDLastBlock FROM companies WHERE SDActive = 1`
    // db.query(sql2, []).then((dbResponse) => {
    //     dbResponse.forEach((company) => {
    //         const SDAddress = company.SDAddress;
    //         const lastBlock = company.SDLastBlock
    //     })
    // });
}

main();
// select equityAddress from companies where equityActive = 1

// select SDAddress from companies where SDActive = 1 
function isEquityTransfer(logEntry) {
    return (logEntry.event === 'Transfer')
}
