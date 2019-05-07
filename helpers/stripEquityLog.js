const blockNumberToTimestamp = require('../web3/blockNumberToTimestamp').blockNumberToTimestamp;

async function stripLog(logEntry, company) {
    return new Promise(async (resolve, reject) => {
        try {
            const timestamp = await blockNumberToTimestamp(logEntry.blockNumber);
            resolve([
                logEntry.transactionHash,
                company.equityAddress,
                logEntry.returnValues.from,
                logEntry.returnValues.to,
                logEntry.blockNumber,
                timestamp,
                logEntry.returnValues.value
            ]);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports.stripLog = stripLog;