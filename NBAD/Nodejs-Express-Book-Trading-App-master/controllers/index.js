var express = require('express');
var router = express.Router();
var session = require('express-session')

var Book = require('../models/Book.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  Book.find({}, function(err, books) {
    if (req.session.user) {
      Book.find({user_id: req.session.user._id}, function(err, userBooks) {
        res.render('index', { user: req.session.user, books: books, userBooks: userBooks });
      })
    } else {
      res.render('index', { user: req.session.user, books: books });
    }
  })
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('auth/login');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('auth/register');
});

module.exports = router;
