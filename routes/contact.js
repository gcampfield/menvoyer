var express = require('express');
var User = require('../models/user');
var Message = require('../models/message');

module.exports = function () {
  var router = express.Router();

  // middleware to require authentication
  function login_required(req, res, next) {
    if (req.isAuthenticated())
    return next();
    res.redirect('/login');
  }

  // GET - /contact/<user.hashid>
  router.get('/contact/:hashid', function (req, res) {
    User.findOne({ 'hashid': req.params.hashid }, function (err, user) {
      if (err) res.status(404);
      else res.render('contact/form', { title: 'contact', user: user, partials: { base: 'base' } });
    });
  });

  // POST - /contact/<user.hashid>
  router.post('/contact/:hashid', function (req, res) {
    User.findOne({ 'hashid': req.params.hashid }, function (err, user) {
      if (!user) return res.status(404).render('404.hjs');
      else {
        var message = new Message();
        message.from = req.body.from;
        message.tohash = req.params.hashid;
        message.subject = req.body.subject;
        message.message = req.body.message;
        message.date = new Date();
        message.save();

        res.render('contact/success', { title: 'success', user: user, partials: { base: 'base' } });
      }
    });
  });

  return router;
}
