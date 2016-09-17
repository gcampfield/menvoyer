var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'contact forms made simple', partials: { base: 'base' }});
});

module.exports = router;
