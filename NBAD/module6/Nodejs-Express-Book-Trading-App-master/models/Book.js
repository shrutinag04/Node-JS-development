var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.ObjectId;
var path = require('path')

mongoose.connect('mongodb://prase:prase@ds255958.mlab.com:55958/booktrading-app');

var BookSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  user_id: {
    type: ObjectId,
    required: true,
    trim: true
  }
});

BookSchema.statics = {

  // create a new book entry
  create: function(req, callback) {
    // validate book input form
    if (!req.body.name)
      return callback("book name is missing")
    if (!req.files.image)
      return callback("upload the book image")
    // upload book image to public/uploads folder
    var img = req.files.image;
    img.name = new Date().getTime().toString()+path.extname(img.name);
    img.mv('public/uploads/'+img.name, function(err) {
      if (err) console.error(err);
    });
    // save the new book object
    var user = new this({
      name: req.body.name,
      image: '/uploads/'+img.name,
      user_id: req.session.user._id
    });
    user.save(err => {
      if (err) callback(err)
      else callback(null, user)
    })
  },

  // get all books offered by a certain user
  getBooksByUser: function(user, callback) {
    this.find({user_id: user._id}, function(err, books) {
      if (err) callback(err)
      else callback(null, books)
    })
  },

}

module.exports = mongoose.model('Book', BookSchema);
