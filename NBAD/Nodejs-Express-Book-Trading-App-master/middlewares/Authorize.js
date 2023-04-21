var session = require('express-session')

var Book = require('../models/Book.js');

module.exports = class Authorize {

  // check if user is logged in
  static isAuthorizedUser(req, res, next) {
    if (req.session.user._id !== req.params.id) {
      res.redirect('/login');
    } else {
      return next();
    }
  }

  // check whether the auth user is book author
  isBookAuthor(req, res, next) {
    Book.findById(req.params.id, function(err, book) {
      if (book.user_id !== req.session.user._id) {
        res.redirect('/home');
      } else {
        return next();
      }
    })
  }

}
