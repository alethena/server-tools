var express = require('express');
var router = express.Router();
const db = require('../database/db');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/equity/:contractAddress', function (req, res, next) {
  const contract = req.params.contractAddress;
  // db.query(),
  res.send('respond with a resource');
});

router.get('/sd/:contractAddress', function (req, res, next) {
  const contract = req.params.contractAddress;
  const sqlQuery = `SELECT timestamp, lastPrice FROM SDTransactions WHERE contractAddress = ? ORDER BY timestamp ASC;`

  db.query(sqlQuery, [contract]).then((prices) => {
    if(prices[0] !== undefined) {
      console.log("PRICES:",prices[0]);
      let outputArray = [];
      prices.forEach((price) =>{
        outputArray.push([new Date(price.timestamp).getTime(), price.lastPrice/10**18])
      });
      res.send(outputArray);
    } else {
      res.send('Contract does not exist')
    }
  });
});


module.exports = router;
