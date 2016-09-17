var express = require('express');

module.exports = function (passport) {
  var router = express.Router();

  // middleware to require authentication
  function login_required(req, res, next) {
    if (req.isAuthenticated())
    return next();
    res.redirect('/');
  }

  // GET - /home
  router.get('/home', login_required, function(req, res) {
    res.render('users/dashboard');
  });

  // GET - /login
  router.get('/login', function(req, res) {
    if (req.user) res.redirect('/home');
    res.render('users/login', { error: req.flash('error') });
  });

  // POST - /login
  router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/home',
    failureRedirect : '/login',
    failureFlash : true
  }));

  // GET - /signup
  router.get('/signup', function(req, res) {
    res.render('users/signup', { message: req.flash('error') });
  });

  // POST - /signup
  router.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/home',
    failureRedirect : '/signup',
    failureFlash : true
  }));

  // GET - /logout
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}
