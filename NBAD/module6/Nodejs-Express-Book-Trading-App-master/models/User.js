var mongoose = require('mongoose')
var bcrypt = require('bcrypt')

mongoose.connect('mongodb://prase:prase@ds255958.mlab.com:55958/booktrading-app');

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  full_name: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
  }
});

/**
 * hashing a password before saving it to the database
 */
 UserSchema.pre('save', function (next) {
   var user = this;
   // only hash the password if it has been modified (or is new)
   if (!user.isModified('password')) return next();
   // generate a salt
   bcrypt.genSalt(10, function(err, salt) {
     if (err) return next(err);
     // hash the password using our new salt
     bcrypt.hash(user.password, salt, function(err, hash) {
       if (err) return next(err);
       // override the cleartext password with the hashed one
       user.password = hash;
       next();
     });
   });
 });

/**
 * save user to session
 * @param  {Object} user user object
 */
UserSchema.statics.saveSession = function (req, user) {
  req.session.cookie.expires = new Date(Date.now() + 3600000 * 24)
  req.session.user = user;
}

/**
 * registers a new user
 * @param  {Request} req request containing all user inputted data
 */
UserSchema.statics.register = function (req, callback) {

  // user registration form validation
  if (!req.body.name || !req.body.email || !req.body.password || !req.body.repassword)
    return callback({err: "some form data is missing"})
  if (req.body.password != req.body.repassword)
    return callback({err: "passwords are not matching"})

  // create a new database-inputtable object
  var userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }

  // validate that user doesnt already exist and create a new database user
  var User = this
  User.findOne({ 'email': req.body.email }, (err, user) => {
    if (err) return callback(err)
    else if (user) return callback({err: "user already exists"})
    else {
      User.create(userData, function (err, user) {
        if (err) callback(err)
        else {
          User.saveSession(req, user)
          callback(null, user);
        }
      });
    }
  });

}

/**
 * authenticate input against database
 */
UserSchema.statics.login = function (req, callback) {
  if (!req.body.email || !req.body.password)
    return callback({err: "some form data is missing"})
  var User = this
  this.findOne({ email: req.body.email }, (err, user) => {
    if (err) return callback(err)
    if (!user) return callback({err: "the user credentials were not found"})
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if (!result) return callback({err: "incorrect password"})
      User.saveSession(req, user)
      return callback(null, user);
    })
  });
}

/**
 * logout session user
 */
UserSchema.statics.logout = function (req) {
  delete req.session.user;
}

/**
 * edit existing user
 * @param  {Object} req request containing the new user data
 */
UserSchema.statics.edit = function (req, callback) {
  this.findById(req.params.id, (err, user) => {
    if (err) console.error(err)
    user.full_name = req.body.fname
    user.city = req.body.city
    user.state = req.body.state
    user.save()
    req.session.user = user;
    return callback(user);
  })
}

module.exports = mongoose.model('User', UserSchema);
