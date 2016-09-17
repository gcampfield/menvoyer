var express = require('express');

module.exports = function (passport) {
  var router = express.Router();

  // GET - /
  router.get('/', function(req, res) {
    res.render('index', { title: 'contact forms made simple', partials: { base: 'base' }});
  });

  return router;
}
