const helpers = require('./helpers.js');
// const contrAddress = '0x6351f1c2e6dea96c9c608aa21c89663a3b7ea88e';
const CronJob = require('cron').CronJob;
const color = require('colors');
const lockfile = require('lockfile');
const abi = require('./abi.json');

const contrAddress = '0x29317B796510afC25794E511e7B10659Ca18048B';

const inLogPath = './rawLogs/eventlogs.json';
const outLogPath = './formattedLogs/eventlogsCleaned.json';
const tsLogPath = './timeStampedLogs/eventlogsTimestamped.json';

async function main(){
    await helpers.fetchEvents(abi,contrAddress,inLogPath);
    await helpers.transformLog(inLogPath,outLogPath);
    await helpers.addTimestamp(outLogPath,tsLogPath);
}


new CronJob('*/1 * * * *', function() {
    try{
        lockfile.lock('./lockfile',{'retries': 0},async ()=>{
            await main();
            lockfile.unlockSync('./lockfile');
        });
    }
    catch(err){
        console.log('ERROR:  '.bold.red,new Date(),' Consider making the time interval longer'.red);
    }
}, null, true);
