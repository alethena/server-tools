const Web3 = require('web3');
const net = require('net');
const config = require('./web3Config.json');
var web3;
var Raven = require('raven');
Raven.config('https://853db40d557b42189a6b178ba7428001@sentry.io/1470742').install();

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
