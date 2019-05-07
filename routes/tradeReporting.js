var express = require('express');
var router = express.Router();
const db = require('../database/db');
const generateVerificationCode = require('../helpers/generateConfirmationCode').codeGenerator;

const validateParameters = require('../helpers/validateReportParameters').validateParameters;

/* GET home page. */
router.get('/reporttrade', async function (req, res, next) {

  validateParameters(req.body).then(async (dataToWrite) => {
    const code = await generateVerificationCode(req.body.email);

    dataToWrite.push(new Date());
    dataToWrite.push(code);

    const sql = `REPLACE INTO reportedTrades (position, emailAddress, tradedVolume, totalPrice, txHash, reason, confirmed, timestamp, code) VALUES(?,?,?,?,?,?,?,?,?);`;
    db.query(sql, dataToWrite).then(() => {
      res.json('Please check your mail!');
    }, (error) => {
      res.status(500).json(error);
    });
    //SEND OUT E-MAIL

  }, (error) => {
    res.status(400).json(error);
  });
});

router.get('/confirmtrade/:code', function (req, res, next) {
  const code = req.params.code;
  const sql = `UPDATE reportedTrades SET confirmed = 1 WHERE code = ?;`;
  db.query(sql, [code]).then(() => {
    res.render('index');
  }, () => {
    res.send("An error occured");
  });
});
module.exports = router;