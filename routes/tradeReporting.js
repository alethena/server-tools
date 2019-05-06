var express = require('express');
var router = express.Router();

const validateParameters = require('../helpers/validateReportParameters').validateParameters;

/* GET home page. */
router.get('/reporttrade', function (req, res, next) {

  validateParameters(req.body).then((dataToWrite) => {
    console.log(dataToWrite);
    //WRITE TO DB
    res.json('Please check your mail!');
  }, (error) => {
    res.status(400).json(error);
  });

});

router.get('/confirmtrade', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

module.exports = router;
