var Web3 = require('web3');
var net = require('net');
var fs = require('fs');
var color = require('colors');
const jsonDiff = require('json-diff');


//Connects to local "fast-sync" rinkeby node
var web3 = new Web3(new Web3.providers.IpcProvider('/home/benjamin/.ethereum/rinkeby/geth.ipc',net));

module.exports.fetchEvents = fetchEvents;

 async function fetchEvents(_abi,_contrAddress,_inLogPath){
  //Instantiate the contract
  var myContract = await new web3.eth.Contract(_abi, _contrAddress);
  // Before doing anything we should check that the node is not syncing currently
  // I.e. call eth.syncing and the answer should be 'false'
  // Else we might end up in a situation where the information we obtain is not up to date but no error is thrown
  await web3.eth.isSyncing( (err,resp)=>{
    if(err){throw(err)}
    else if (resp === false){console.log('-ETH node is synced'.bold.green)}
    else {console.error('Something is wrong with your Ethereum node'.red)}
  })

  try{
    console.log('-fetching events'.yellow)
    //Fetch the events
    pastEvents = await myContract.getPastEvents('allEvents', {fromBlock: 1, toBlock: 'latest'});
    console.log('-writing file'.yellow)
    //Write the raw log file
    fs.writeFileSync(_inLogPath, JSON.stringify(pastEvents), ()=> {
      console.log('-file written'.bold.green)
    })
  }
  catch(error){
    console.error(error)}
}



module.exports.transformLog = transformLog;

async function transformLog(_inLogPath, _outLogPath){
    var eventlogs = JSON.parse(fs.readFileSync(_inLogPath));
    var output = [];
    var length = eventlogs.length -1;
    await eventlogs.forEach(async element => {

        if (length == 0){
            output.sort(comp);
            fs.writeFileSync(_outLogPath,JSON.stringify(output));
            console.log('-log was transformed'.bold.green);
        }
        
        var temp = new Object({
            "address": element.address,
            "blockNumber": element.blockNumber,
            "transactionHash": element.transactionHash,
            "transactionIndex": element.transactionIndex,
            "logIndex": element.logIndex,
            "event": element.event,
            "from": element.returnValues.from,
            "to": element.returnValues.to,
            "value": element.returnValues.value,
            "shareholder": element.returnValues.shareholder,
            "amount": element.returnValues.amount,
            "message": element.returnValues.message
            })
            output.push(temp);            
            length--;
    });
}

function comp(log1,log2){
    if (log1.timestamp !== log2.timestamp){
        return log1.timestamp -log2.timestamp
    } else if (log1.transactionIndex !== log2.transactionIndex){
        return log1.transactionIndex-log2.transactionIndex
    } else if(log1.logIndex !== log2.logIndex){
        return log1.logIndex-log2.logIndex
    } else {
        return 0
    }
}



module.exports.addTimestamp = addTimestamp;

// 

async function addTimestamp(_outLogPath,_tsLogPath){
    console.log('-started timestamping'.yellow)
    var output = [];
    var eventlogsCleaned = JSON.parse(fs.readFileSync(_outLogPath));
    var length = eventlogsCleaned.length;

    eventlogsCleaned.forEach(async element => {
        var block = await web3.eth.getBlock(element.blockNumber);
        length = length -1;
        element.timestamp = block.timestamp;
        output.push(element);
        if (length ==0){
            console.log('-writing timestamped file'.yellow);
            output.sort(comp);
            // var compare = jsonDiff.diff(JSON.parse(fs.readFileSync(_tsLogPath)),output);
            //     //console.log(output);
            //     //console.log(compare);
            // if (compare){
            //     compare.forEach(el => {
            //         if (el[1]){
            //             if(el[1].timestamp < )
            //             console.log(el[1].timestamp)
            //         }
            //     }
            //     )
            // }
            fs.writeFileSync(_tsLogPath,JSON.stringify(output));
            console.log('-timestamped file saved'.bold.green);
            }
        return 0;
    })};

    
    