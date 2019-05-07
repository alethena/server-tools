var schedule = require('node-schedule');

const fetchEquity = require('./eventLoopFetchEquity').fetchEquity;
const fetchSD = require('./eventLoopFetchSD').fetchSD;
const SDReport = require('./eventLoopSDReport').SDReport;
function main() {
    var j = schedule.scheduleJob('*/1 * * * *', async function () {
        console.log(new Date());
        await fetchEquity();
        await fetchSD();
        await SDReport();
    });
}

module.exports.cronJobs = main;
