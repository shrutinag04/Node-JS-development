var upload = require('express-fileupload');
var express = require('express');
var router = express.Router();
var fs = require('fs')

var Authenticator = require('../middlewares/Authenticate.js');

var Book = require('../models/Book.js');
var Trade = require('../models/Trade.js');

/* create a new book */
router.post('/add', Authenticator.isAuthenticated, function(req, res, next) {
  Book.create(req, function(err, book) {
    if (err) res.render('home', {user: req.session.user, err: err});
    else res.redirect('/home')
  })
})

/* remove existing book */
router.get('/:id/remove', Authenticator.isAuthenticated, function(req, res, next) {
  Book.findById(req.params.id, (err, book) => {
    fs.unlink('./public'+book.image, function(error) {
        if (error) throw error;
        console.log('Deleted ' + book.image);
    });
    Book.remove({ _id: req.params.id }, (err) => {
      if (err) res.status(500).send(err)
      else res.redirect('/home')
    })
  })
})

/* offer a book trade */
router.get('/:wants_id/trade/:offering_id', Authenticator.isAuthenticated, function(req, res, next) {
  Trade.create(req, (err, trade) => {
    if (err) res.status(500).send(err)
    else res.redirect('/')
  })
})

/* accept a book trade */
router.get('/trade/:id/accept', Authenticator.isAuthenticated, function(req, res, next) {
  Trade.findById(req.params.id, function(err, trade) {
    if (err) console.error(err);
    trade.accepted = true;
    trade.save();
    res.redirect('/home');
  })
})

/* decline a book trade */
router.get('/trade/:id/decline', Authenticator.isAuthenticated, function(req, res, next) {
  Trade.remove({_id: req.params.id}, function(err, trade) {
    if (err) console.error(err);
    res.redirect('/home');
  })
})

module.exports = router;
