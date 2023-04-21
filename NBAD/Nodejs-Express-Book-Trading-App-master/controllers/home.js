var session = require('express-session')
var express = require('express');
var router = express.Router();

var Authenticator = require('../middlewares/Authenticate.js');

var Book = require('../models/Book.js');
var Trade = require('../models/Trade.js');
var User = require('../models/User.js')

/* get user private are */
router.get('/', Authenticator.isAuthenticated, function(req, res, next) {
  Book.getBooksByUser(req.session.user, function(err, books) {
    Trade.find({'wants.name': req.session.user.name}, function(err, trades_to_you) {
      Trade.find({'offering.name': req.session.user.name}, function(err, your_trades) {
        res.render('home', {user: req.session.user, books: books, trades_to_you: trades_to_you, your_trades: your_trades});
      })
    })
  })
})

module.exports = router;
