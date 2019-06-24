var express = require('express');
var router = express.Router();
const db = require('../database/db');
const QuickEncrypt = require('quick-encrypt')
let keys = QuickEncrypt.generate(1024) // Use either 2048 bits or 1024 bits.
const sendSignupMail = require('../mailer/signupMail').sendSignupMail;

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/company/add', function (req, res, next) {
  console.log(req.body);

  const sql = `INSERT INTO companies VALUES(?,?,?,?,?,?,?,?,?);`;

  let dataToInsert = [
    req.body.tokenSymbol,
    req.body.companyName,
    req.body.equityAddress,
    Number(req.body.equityActive),
    req.body.SDAddress,
    Number(req.body.SDActive),
    0, 0, 0
  ];

  db.query(sql, dataToInsert).then(() => {
    res.send('Company registered!');
  }, (error) => {
    if (error.errno == 1062) {
      res.status(200).send("Company exists already");
    } else {
      res.status(500).send(error);
    }
  });
});


router.post('/user/requestmail', async function (req, res, next) {
  const email = req.body.email;
  const contractaddress = req.body.contractaddress;
  console.log(email);
  const encryptedText = QuickEncrypt.encrypt(email, keys.public);
  let link = 'api.alethena.com/servertools/admin/user/add/authenticated/'
  link += email;
  link += '/';
  link += encryptedText;
  link += '/';
  link += contractaddress;
  try {
    await sendSignupMail(link, email);
  } catch (error) {
    console.log(error);
  }
  // CALL emailer function with email and encrypted text
  res.send('Email sent');

})

router.get('/user/add/authenticated/:email/:enc/:contractaddress', function (req, res, next) {
  const email = req.params.email;
  const enc = req.params.enc;
  const contractAddress = req.params.contractaddress;

  let check = QuickEncrypt.decrypt(enc, keys.private);

  if (check === email) {
    const sql = `INSERT INTO notifications VALUES(?,?);`;

    let dataToInsert = [
      contractAddress,
      email
    ];

    db.query(sql, dataToInsert).then(() => {
      res.send('You are now registered!');
    }, (error) => {
      res.status(500).send(error);
    });
  } else {
    res.render('error');
  }
});

router.post('/user/add', function (req, res, next) {
  console.log(req.body);

  const sql = `INSERT INTO notifications VALUES(?,?);`;

  let dataToInsert = [
    req.body.contractAddress,
    req.body.emailAddress
  ];

  db.query(sql, dataToInsert).then(() => {
    res.send('User registered!');
  }, (error) => {
    if (error.errno == 1062) {
      res.status(200).send("User exists already");
    } else {
      res.status(500).send(error)
    }
  });
});

module.exports = router;


// "INSERT INTO `companies` VALUES ('ALEQ','Alethena','0x18a4251cd23a4e235987a11d2d36c0138e95fa7c',1,'0xd091951a17030aee1c0ab1319d6876048253bdc3',1,4335292,4335298,0);"