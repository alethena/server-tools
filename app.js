var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var adminRouter = require('./routes/admin');
var dataRouter = require('./routes/data');
var indexRouter = require('./routes/index');
var tradeReportingRouter = require('./routes/tradeReporting');
var usersRouter = require('./routes/users');
var dispenserRouter = require('./routes/dispenser');
var Raven = require('raven');
// Raven.config('https://853db40d557b42189a6b178ba7428001@sentry.io/1470742').install();

var helmet = require('helmet');
const cors = require('cors');
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(helmet());
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false   
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/servertools/public')));

app.use('/servertools/', indexRouter);
app.use('/servertools/users', usersRouter);
app.use('/servertools/reporting', tradeReportingRouter);
app.use('/servertools/admin', adminRouter);
app.use('/servertools/data', dataRouter);
app.use('/servertools/dispenser', dispenserRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;