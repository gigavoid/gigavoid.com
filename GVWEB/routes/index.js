var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.app.get('database');
  var posts = db.get('index');
  posts.find({},{},function(error, posts){
    res.render('index', { title: 'Gigavoid - Home', posts: posts});
  });
});

router.get('/games', function(req, res, next) {
  var db = req.app.get('database');
  var posts = db.get('games');
  posts.find({},{},function(error, posts){
    res.render('games', { title: 'Gigavoid - Games', posts: posts});
  });
});

router.get('/company', function(req, res, next) {
  var db = req.app.get('database');
  var posts = db.get('company');
  posts.find({},{},function(error, posts) {
    res.render('company', {title: 'Gigavoid - Company', posts: posts});
  });
});

router.get('/support', function(req, res, next) {
  res.render('support', { title: 'Gigavoid - Support'});
});

module.exports = router;