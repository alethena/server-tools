var schedule = require('node-schedule');

const fetchEquity = require('./eventLoopFetchEquity').fetchEquity;
const fetchSD = require('./eventLoopFetchSD').fetchSD;
// const SDReport = require('./eventLoopSDReport').SDReport;

var j = schedule.scheduleJob('*/1 * * * *', function () {
    console.log(new Date());
});