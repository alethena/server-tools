const Web3 = require("web3");
const net = require("net");
const fs = require("fs");
const Promise = require("bluebird");

//Connects to local "fast-sync" rinkeby node
try {
  var web3 = new Web3(
    new Web3.providers.IpcProvider(
      "/home/benjamin/.ethereum/rinkeby/geth.ipc",
      net
    )
  );
} catch (error) {
  console.log(error);
}

function fetchEvents(_abi, _contrAddress) {
  return new Promise(async function(resolve, reject) {
    try {
      let answ = await syncTest();
      console.log(answ);
      var myContract = await new web3.eth.Contract(_abi, _contrAddress);
      let pastEvents = await myContract.getPastEvents("allEvents", {
        fromBlock: 1,
        toBlock: "latest"
      });
      resolve(pastEvents);
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}

function syncTest() {
  return new Promise(async function(resolve, reject) {
    web3.eth.isSyncing((err, response) => {
      if (err || response !== false) {
        reject(
          "ERROR: ".bold.red +
            new Date() +
            " Could not trigger log collection. There may be a problem with your node.",
          false
        );
      } else {
        resolve("INFO: ".green + new Date() + " Triggered log collection".bold);
      }
    });
  });
}

function addTimestamp(eventlogs) {
  return new Promise(async function(resolve, reject) {
    var output = [];
    var length = eventlogs.length - 1;
    await asyncForEach(eventlogs, async element => {
      try {
        var block = await web3.eth.getBlock(element.blockNumber);
        var receipt = await web3.eth.getTransactionReceipt(element.transactionHash);
      } catch (error) {
        reject(error);
      }

      var temp = new Object({
        log: element,
        receipt: receipt,
        timestamp: block.timestamp
      });

      output.push(temp);

      if (length === 0) {
        output.sort(orderFcn);
        resolve(output);
      }
      length--;
    });
  });
}

function orderFcn(log1, log2) {
  if (log1.timestamp !== log2.timestamp) {
    return log1.timestamp - log2.timestamp;
  } else if (log1.transactionIndex !== log2.transactionIndex) {
    return log1.transactionIndex - log2.transactionIndex;
  } else if (log1.logIndex !== log2.logIndex) {
    return log1.logIndex - log2.logIndex;
  } else {
    return 0;
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

module.exports.fetchEvents = fetchEvents;
module.exports.addTimestamp = addTimestamp;
module.exports.syncTest = syncTest;
