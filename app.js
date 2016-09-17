var bodyParser = require('body-parser');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var path = require('path');
var session = require('express-session');

var configDB = require('./config/database');

var app = express();

mongoose.connect(configDB.url);

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(express.static(path.join(__dirname, 'static')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
})); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);

var index = require('./routes/index');
var users = require('./routes/users')(passport);

app.use('/', index);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
