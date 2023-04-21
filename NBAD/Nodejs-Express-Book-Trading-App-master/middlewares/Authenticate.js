var session = require('express-session')

module.exports = class Authenticator {

  // check if user is logged in
  static isAuthenticated(req, res, next) {
    if (!req.session.user) {
      res.redirect('/login');
    } else {
      return next();
    }
  }

}
