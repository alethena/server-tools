const Web3 = require('web3');
const net = require('net');
const fs = require('fs');
const jsonDiff = require('json-diff');


//Connects to local "fast-sync" rinkeby node
var web3 = new Web3(new Web3.providers.IpcProvider('/home/benjamin/.ethereum/rinkeby/geth.ipc',net));


async function fetchEvents(_abi,_contrAddress,_inLogPath){
    var myContract = await new web3.eth.Contract(_abi, _contrAddress);
    let syncFailed = await syncCheck();
    if(syncFailed){
        console.log('ERROR:'.bold.red,new Date(),'Could not trigger log collection. There may be a problem with your node.');
        return;
    }
    else{
        console.log('INFO:'.green,new Date(),'Triggered log collection'.bold);
    }
    try{
        pastEvents = await myContract.getPastEvents('allEvents', {fromBlock: 1, toBlock: 'latest'});
        fs.writeFileSync(_inLogPath, JSON.stringify(pastEvents));
    }
    catch(error){
        console.error(error);}
}


async function transformLog(_inLogPath, _outLogPath){
    let syncFailed = await syncCheck();
    if(syncFailed){
        return;
    }
    var eventlogs = JSON.parse(fs.readFileSync(_inLogPath));
    var output = [];
    var length = eventlogs.length -1;
    await eventlogs.forEach(async element => {

        if (length === 0){
            output.sort(orderFcn);
            fs.writeFileSync(_outLogPath,JSON.stringify(output));
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
        });
        output.push(temp);            
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


async function addTimestamp(_outLogPath,_tsLogPath){
    let syncFailed = await syncCheck();
    if(syncFailed){
        return;
    }
    var output = [];
    var eventlogsCleaned = JSON.parse(fs.readFileSync(_outLogPath));
    var length = eventlogsCleaned.length;

    eventlogsCleaned.forEach(async element => {
        var block = await web3.eth.getBlock(element.blockNumber);
        length--;
        element.timestamp = block.timestamp;
        output.push(element);
        if (length ==0){checkAndWrite(output, _tsLogPath);}
        return 0;
    });
}

function checkAndWrite(_output,_tsLogPath){
    _output.sort(orderFcn);
    fs.writeFileSync(_tsLogPath,JSON.stringify(_output));
    console.log('INFO:'.green, new Date(),'Log saved');
    return;
}

function syncCheck(){
    web3.eth.isSyncing( (err,resp)=>{
        if(!err && resp === false){
            return false;
        }else{
            return true;
        }
    });
}

module.exports.fetchEvents = fetchEvents;
module.exports.transformLog = transformLog;
module.exports.addTimestamp = addTimestamp;