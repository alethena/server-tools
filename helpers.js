const Web3 = require('web3');
const net = require('net');
const fs = require('fs');

//Connects to local "fast-sync" rinkeby node
var web3 = new Web3(new Web3.providers.IpcProvider('/home/benjamin/.ethereum/rinkeby/geth.ipc',net));



async function fetchEvents(_abi,_contrAddress,_inLogPath,callback){

    web3.eth.isSyncing((err,response) =>{
        if(err || response !== false){
            callback('ERROR: '.bold.red + new Date() + ' Could not trigger log collection. There may be a problem with your node.',false)
        }
        else{
            console.log('INFO: '.green + new Date() +' Triggered log collection'.bold);
        }
    })

    try{
        var myContract = await new web3.eth.Contract(_abi, _contrAddress);
    }
    catch(err){
        callback(err,false);
    }
    
    try{
        pastEvents = await myContract.getPastEvents('allEvents', {fromBlock: 1, toBlock: 'latest'});
        fs.writeFileSync(_inLogPath, JSON.stringify(pastEvents));
        callback(false,pastEvents);
    }
    catch(error){
        console.error(error);
        callback(error,false);
    }
}


async function addTimestamp(_outLogPath, eventlogs, callback){
    var output = [];
    var length = eventlogs.length-1;
    await asyncForEach(eventlogs, async element => {
        try{
            var block = await web3.eth.getBlock(element.blockNumber);
        }
        catch(error){
            callback(error,false)
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
            "message": element.returnValues.message,
            "timestamp": block.timestamp
        });

        output.push(temp);            
        

        if (length === 0){
            output.sort(orderFcn);
            callback(false,output);
        }
        length--;
    });
}

function orderFcn(log1,log2){
    if (log1.timestamp !== log2.timestamp){
        return log1.timestamp -log2.timestamp;
    } else if (log1.transactionIndex !== log2.transactionIndex){
        return log1.transactionIndex-log2.transactionIndex;
    } else if(log1.logIndex !== log2.logIndex){
        return log1.logIndex-log2.logIndex;
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