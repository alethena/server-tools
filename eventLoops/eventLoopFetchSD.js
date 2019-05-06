const db = require('../database/db');
const fetchEvents = require('../web3/fetchEvents').fetchEvents;
const blockNumberToTimestamp = require('../web3/blockNumberToTimestamp').blockNumberToTimestamp;
const getLatestBlockNumber = require('../web3/getLatestBlockNumber').getLatestBlockNumber;
const fetchTransactionReceipt = require('../web3/fetchTransactionReceipt').fetchTransactionReceipt;
const ALEQABI = require('../abis/ALEQABI.json');
const SDABI = require('../abis/SDABI.json');
//Queries


async function main() {
    //Equity queries
    const sql1 = `SELECT SDAddress, SDLastBlock FROM companies WHERE SDActive = 1`;
    const latestBlock = await getLatestBlockNumber();

    await db.query(sql1, []).then((dbResponse) => {
        dbResponse.forEach(async (company) => {
            try {
                const logs = await fetchEvents(SDABI, company.SDAddress, company.SDLastBlock);

                logs.filter(isSDTransaction).forEach(async (logEntry) => {
                    // console.log(logEntry.returnValues);
                    const timestamp = await blockNumberToTimestamp(logEntry.blockNumber);
                    const txReceipt = await fetchTransactionReceipt(logEntry.transactionHash);

                    // console.log(txReceipt.logs);

                    // 0 gebühr

                    // 1 Zahlung

                    // 2 ALEQ transfer

                    let user;
                    let buy;
                    let totalPrice;

                    if (logEntry.event === "SharesPurchased") {
                        user = logEntry.returnValues.buyer;
                        buy = true;
                        totalPrice = logEntry.returnValues.totalPrice;

                    } else {
                        user = logEntry.returnValues.seller;
                        buy = false;
                        totalPrice = logEntry.returnValues.buyBackPrice;
                    }

                    console.log(
                        logEntry.transactionHash,
                        company.SDAddress,
                        buy,
                        !buy,
                        totalPrice,
                        // fee,
                        logEntry.returnValues.nextPrice,
                        user,
                        logEntry.returnValues.amount,
                        logEntry.blockNumber,
                        timestamp
                    );


                    const sqlInsertTx = `REPLACE INTO SDTransactions (txHash, contractAddress, buy, sell, price, fee, lastPrice, user, amount, blockNumber, timestamp) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
                    await db.query(sqlInsertTx,
                        [
                            logEntry.transactionHash,
                            company.SDAddress,
                            buy,
                            !buy,
                            totalPrice,
                            0,
                            logEntry.returnValues.nextPrice,
                            user,
                            logEntry.returnValues.amount,
                            logEntry.blockNumber,
                            timestamp
                        ]);
                })
            } catch (error) {
                console.log(error);
            }
        })

    }, (err) => {
        console.log(err);
    });
}

// module.exports.main = main;
main();
// select equityAddress from companies where equityActive = 1

// select SDAddress from companies where SDActive = 1 
function isSDTransaction(logEntry) {
    return (logEntry.event === 'SharesPurchased' || logEntry.event === 'SharesSold');
}