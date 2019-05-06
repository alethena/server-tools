const web3 = require('./gethConnection').web3;

async function blockNumberToTimestamp(blockNumber) {
    return new Promise(async function(resolve, reject) {
        try {
            const block = await web3.eth.getBlock(blockNumber);
            timestamp = new Date (block.timestamp*1000);
            resolve(timestamp);;
        } catch (error) {
            reject(error);
        }
    })
}

module.exports.blockNumberToTimestamp = blockNumberToTimestamp;
