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
    lockfile.lock('./lockfile',{'retries':0},(err) => {
        if (err){
            console.log('ERROR: '.bold.red + new Date() + ' Consider making the time interval longer'.red);
        } 
        else{
            helpers.fetchEvents(abi,contrAddress,inLogPath, (err,eventLog) => {
                if (err){
                    console.log(err);
                }
                else{
                    helpers.addTimestamp(tsLogPath, eventLog, (err,formattedLog) => {
                        if (err){
                            console.log(err);
                        }
                        else{
                            fs.writeFileSync(tsLogPath,JSON.stringify(formattedLog));
                            console.log('INFO: '.green + new Date() +' Log saved');
                        }
                        lockfile.unlock('./lockfile')
                    });
                }
            });
        }
        
    });
}

new CronJob('*/20 * * * * *', function() {
    main();
}, null, true);
