var express = require('express');
var router = express.Router();
var session = require('express-session')

var Authorize = require('../middlewares/Authorize.js');

var User = require('../models/User.js')

/* login a user */
router.post('/login', function(req, res, next) {
  User.login(req, function(err, user) {
    if (err) res.render('auth/login', err);
    else res.redirect('/home');
  });
});

/* register a new user */
router.post('/register', function(req, res, next) {
  User.register(req, function(err, user) {
    if (err) res.render('auth/register', err);
    else res.redirect('/home');
  });
});

/* GET /logout */
router.get('/logout', function(req, res, next) {
  User.logout(req);
  res.redirect('/');
});

/* edit existing user */
router.post('/:id/edit', Authorize.isAuthorizedUser, function(req, res, next) {
  User.edit(req, function(user) {
    res.redirect('/home')
  })
})

/* edit existing user */
router.get('/:name', function(req, res, next) {
  User.findOne({name: req.params.name}, function(err, user) {
    if (err) res.render('auth/register', err);
    else res.render('user', {user: user});
  })
})

module.exports = router;
