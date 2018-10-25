const helpers = require('./helpers.js');

// const contrAddress = '0x6351f1c2e6dea96c9c608aa21c89663a3b7ea88e';
const CronJob = require('cron').CronJob;
const color = require('colors');
const lockfile = require('lockfile');
const abi = require('./abi.json');
const fs = require('fs');


const contrAddress = '0x29317B796510afC25794E511e7B10659Ca18048B';

const inLogPath = './rawLogs/eventlogs.json';
const tsLogPath = './timeStampedLogs/eventlogsTimestamped.json';

async function main(){
    try{
        await helpers.syncTest();
        lockfile.lockSync('./lockfile',{'retries':0});
        let rawLog = await helpers.fetchEvents(abi,contrAddress,inLogPath);
        let formattedLog = await helpers.addTimestamp(tsLogPath, rawLog);
        fs.writeFileSync(tsLogPath,JSON.stringify(formattedLog));
        console.log('INFO: '.green + new Date() +' Log saved'); 
        lockfile.unlockSync('./lockfile');
    }

    // We distinguish between an error due to existing lockfile and random other errors
    // This is necessary in order to unloc the lockfile, e.g. if the node falls out of sync

    catch(error){
        if (error.code==='EEXIST'){
            console.log('ERROR: '.bold.red + new Date() + ' Consider making the time interval longer'.red);
        }
        else{
            console.log(error);
            lockfile.unlockSync('./lockfile');
        }
    }
}

new CronJob('*/5 * * * *', function() {
    main();
}, null, true);
