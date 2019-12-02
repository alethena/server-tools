const Web3 = require('web3');
const net = require('net');
const config = require('./web3Config.json');
var web3;
var Raven = require('raven');
Raven.config('https://c109b2efca9941dcac153716d23172d6@sentry.io/1811490').install();

try {
    web3 = new Web3(
        new Web3.providers.IpcProvider(
            config.IPCPath,
            net
        )
    );

} catch (error) {
    Raven.captureException(error);
}

module.exports.web3 = web3;
