var express = require('express');
var router = express.Router();
const db = require('../database/db');
const generateVerificationCode = require('../helpers/generateConfirmationCode').codeGenerator;
const validateParameters = require('../helpers/validateReportParameters').validateParameters;
const sendConfirmationMail = require('../mailer/confirmationMail').sendConfirmationMail;
const ejs = require('ejs');

/* GET home page. */
router.post('/reporttrade', async function (req, res, next) {
  console.log(req.body);
  validateParameters(req.body).then(async (dataToWrite) => {
    const code = await generateVerificationCode(req.body.email);

    dataToWrite.push(new Date());
    dataToWrite.push(code);

    const sql = `REPLACE INTO reportedTrades (position, emailAddress, tradedVolume, totalPrice, txHash, reason, confirmed, timestamp, code) VALUES(?,?,?,?,?,?,?,?,?);`;
    db.query(sql, dataToWrite).then(async () => {

      //SEND THE MAIL here!!!
      try {
        ejs.renderFile('./views/messageBody.ejs', {
          'confURL': 'http://104.196.209.167/reporting/confirmtrade/' + code
        }, null, async function (err, str) {
          await sendConfirmationMail(str, req.body.emailAddress);
        });
      } catch (error) {
        res.status(500).json(error);
      }
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
  db.query(sql, [code]).then((response) => {
    if (response.changedRows === 0) {
      res.render('error');
    } else {
      console.log(response.changedRows);
      res.render('index');
    }
  }, () => {
    res.send("An error occured");
  });
});

router.get('/recenttrades', function (req, res, next) {
  const sql = 'SELECT timestamp, position, tradedVolume, totalPrice, txHash FROM reportedTrades WHERE confirmed = 1;';
  db.query(sql, []).then((trades) => {
    console.log(trades);
    res.send(trades);
  });
})
module.exports = router;
