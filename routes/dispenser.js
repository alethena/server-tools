var express = require('express');
var router = express.Router();
const db = require('../database/db');
const web3 = require('../web3/gethConnection').web3;
const abi = require('../abis/ALEQABI.json');
const ALEQAddress = "0x18A4251cD23A4e235987a11d2d36C0138E95fA7c";

/* GET users listing. */
router.get('/:txhash/:number', async function (req, res, next) {
    let txReceipt = null;
    let ID = setInterval(async () => {
        txReceipt = await web3.eth.getTransactionReceipt(req.params.txhash);
        console.log("PING!");
        if (txReceipt) {
            clearInterval(ID);
            web3.eth.getCoinbase((error, coinbase) => {

                web3.eth.personal.unlockAccount(coinbase, 'ShareDispens', 10).then((coinbaseUnlocked) => {
                    console.log('Coinbase: ', coinbase);
                    console.log('Unlocked: ', coinbaseUnlocked);

                    const ALEQ = new web3.eth.Contract(abi, ALEQAddress, {
                        gasPrice: 20 * 10 ** 9,
                        from: coinbase,
                        gas: 70000
                    });
                    console.log("from: ", txReceipt.from);
                    // console.log(ALEQ.methods);
                    ALEQ.methods.transfer(txReceipt.from, req.params.number).send().then((tx2Receipt) => {
                        console.log('TX Receipt for tx1: ', tx2Receipt);
                        res.json(tx2Receipt);
                    }).catch((err)=> {
                        console.log(err);
                    });

                });
            })

        }
    }, 1000);
});

module.exports = router;