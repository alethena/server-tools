const helpers = require('./helpers.js');

const CronJob = require('cron').CronJob;
const color = require('colors');
const lockfile = require('lockfile');
const abi = require('./abi.json');
const fs = require('fs');


const contrAddress = '0x6351f1c2e6DEa96c9C608aA21c89663A3b7EA88E';

const inLogPath = './rawLogs/eventlogs.json';
const tsLogPath = '/var/www/html/eventlogsTimestamped.json';

async function main(){
    try{
        await helpers.syncTest();
        lockfile.lockSync('./lockfile',{'retries':0});

        let rawLog = await helpers.fetchEvents(abi,contrAddress);
        fs.writeFileSync(inLogPath,JSON.stringify(rawLog));

        let formattedLog = await helpers.addTimestamp(rawLog);
        fs.writeFileSync(tsLogPath,JSON.stringify(formattedLog));

        console.log('INFO: '.green + new Date() +' Log saved'); 
        lockfile.unlockSync('./lockfile');
    }

    // We distinguish between an error due to existing lockfile and random other errors
    // This is necessary in order to unlock the lockfile, e.g. if the node falls out of sync

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
