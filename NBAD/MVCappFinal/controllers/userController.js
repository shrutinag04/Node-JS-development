const model = require("../models/user");
const items = require("../models/items");
const trade = require("../models/trade");

exports.new = (req, res) => {
  return res.render("./user/new");
};

exports.create = (req, res, next) => {
  let user = new model(req.body); //create a new story document
  user
    .save() //insert the document to the database
    .then((user) => res.redirect("/users/login"))
    .catch((err) => {
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        return res.redirect("/users/new");
      }

      if (err.code === 11000) {
        req.flash("error", "Email has been used");
        return res.redirect("/users/new");
      }

      next(err);
    });

  //res.send('Created a new story');
};

exports.getUserLogin = (req, res, next) => {
  return res.render("./user/login");
};

exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  model
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("wrong email address");
        req.flash("error", "wrong email address");
        res.redirect("/users/login");
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user._id;
            req.flash("success", "You have successfully logged in");
            res.redirect("/users/profile");
          } else {
            req.flash("error", "wrong password");
            res.redirect("/users/login");
          }
        });
      }
    })
    .catch((err) => next(err));
};

exports.profile = (req, res, next) => {
  let id = req.session.user;
  Promise.all([
    model.findById(id),
    items.find({ author: id }),
    trade.find(),
    items.find(),
  ])
    .then((results) => {
      const [user, items, tradeItems, allItems] = results;
      res.render("./user/profile", { user, items, tradeItems, allItems });
      //console.log(results);
      console.log(user);
      console.log(items);
      console.log(tradeItems);
    })
    .catch((err) => next(err));
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    else res.redirect("/");
  });
};
