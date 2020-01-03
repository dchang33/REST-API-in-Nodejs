require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport = require('./passport');

var indexController = require('./routes/index');
var loginRestController = require('./rest/login');
var usersRestController = require('./rest/users');
var programRestController = require('./rest/programs');
var eventRestController = require('./rest/events');
var app = express();

const mongoose = require('mongoose');
mongoose.connection.on('connected', () =>
  console.log(`Mongoose connected to ${process.env.DBURL}`)
);
mongoose.connection.on('disconnected', () =>
  console.log('Mongoose disconnected.')
);
mongoose.connect(process.env.DBURL);

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false
  })
);

app.use('/', indexController);
app.use('/api/users', usersRestController);
app.use('/api/login', loginRestController);
app.use('/api/programs', programRestController);
app.use('/api/events', eventRestController);
app.use(
  '/api/',
  passport.authenticate('jwt', {
    session: false,
    failWithError: true
  })
);
app.use('/api/users', usersRestController);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (req.originalUrl.startsWith('/api/')) {
    res.json({ msg: err.message });
  } else {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.render('error');
  }
});

async function shutdown(signal, callback) {
  console.log(`${signal} received.`);
  await mongoose.disconnect();
  if (typeof callback === 'function') callback();
  else process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.once('SIGUSR2', signal => {
  shutdown(signal, () => process.kill(process.pid, 'SIGUSR2'));
});

module.exports = app;
app.listen(3000);
console.log('Running on port 3000...');
