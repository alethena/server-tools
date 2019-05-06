const blockNumberToTimestamp = require('../web3/blockNumberToTimestamp').blockNumberToTimestamp;

async function stripLog(logEntry, company) {
    return new Promise(async (resolve, reject) => {
        try {
            const timestamp = await blockNumberToTimestamp(logEntry.blockNumber);
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

            resolve([
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
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.stripLog = stripLog;
