var schedule = require('node-schedule');

const fetchEquity = require('./FetchEquity').fetchEquity;
const fetchSD = require('./FetchSD').fetchSD;
const SDReport = require('./SDReport').SDReport;
const generateLedgyLog = require('./Ledgy').generateLedgyLog;

function main() {
    var j = schedule.scheduleJob('*/1 * * * *', async function () {
        console.log(new Date());
        await fetchEquity();
        await fetchSD();
        await SDReport();
        await generateLedgyLog();
    });
}

module.exports.cronJobs = main;
