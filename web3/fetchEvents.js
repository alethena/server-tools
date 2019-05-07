const web3 = require('./gethConnection').web3;


async function fetchEvents(abi, contractAddress, startingBlock) {
    return new Promise(async function (resolve, reject) {
        try {
            const myContract = await new web3.eth.Contract(abi, contractAddress);
            const pastEvents = await myContract.getPastEvents("allEvents", {
                fromBlock: startingBlock,
                toBlock: "latest"
            });
            resolve(pastEvents);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    })
}

module.exports.fetchEvents = fetchEvents;
