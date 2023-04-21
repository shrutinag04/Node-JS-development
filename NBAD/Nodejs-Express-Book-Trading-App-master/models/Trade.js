var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.ObjectId;

mongoose.connect('mongodb://prase:prase@ds255958.mlab.com:55958/booktrading-app');

var Book = require('./Book.js')
var User = require('./User.js')

var TradeSchema = new mongoose.Schema({
  offering: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  wants: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  offering_user: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  wants_user: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  accepted: {
    type: Boolean,
    required: true
  }
});

TradeSchema.statics = {

  // create a new trade entry
  create: function(req, callback) {
    var trade = new this({
      accepted: false
    });
    Book.findById(req.params.offering_id, function(err, book) {
      trade.offering.name = book.name;
      trade.offering.image = book.image;
      User.findById(book.user_id, function(err, user) {
        trade.offering_user.name = user.name;
        trade.offering_user.email = user.email;
        Book.findById(req.params.wants_id, function(err, book) {
          trade.wants.name = book.name;
          trade.wants.image = book.image;
          User.findById(book.user_id, function(err, user) {
            trade.wants_user.name = user.name;
            trade.wants_user.email = user.email;
            // save the new trade object
            trade.save(err => {
              if (err) callback(err)
              else callback(null, trade)
            })
          })
        })
      })
    })
  },

}


module.exports = mongoose.model('Trade', TradeSchema);
