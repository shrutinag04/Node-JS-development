const { nextTick } = require("process");
const model = require("../models/items");
const { isLoggedIn } = require("../middlewares/auth");
const { watch } = require("fs/promises");
const items = require("../models/items");
const trade = require("../models/trade");
const user = require("../models/user");

const { PerformanceNodeTiming } = require("perf_hooks");
exports.index = (req, res, next) => {
  model
    .find()
    .then((items) => {
      if (items) {
        let groupBy = (array, key) => {
          return array.reduce((result, obj) => {
            (result[obj[key]] = result[obj[key]] || []).push(obj);
            return result;
          }, {});
        };
        items = groupBy(items, "category");
        JSON.stringify(items);
        // console.log(items);
        res.render("./items/index", { items });
      }
    })
    .catch((err) => next(err));
};
exports.new = (req, res) => {
  res.render("./items/new");
};
exports.about = (req, res) => {
  res.render("about");
};
exports.contact = (req, res) => {
  res.render("contact");
};

exports.create = (req, res, next) => {
  //res.send('Created a new item');
  let item = new model(req.body); //create new item
  item.author = req.session.user;
  item
    .save() //insert into db
    .then((item) => res.redirect("/items"))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
        res.redirect("back");
      }
      next(err);
    });
};
exports.show = (req, res, next) => {
  let flag = false;
  let id = req.params.id;
  /*  if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err=new Error('Invalid item id');
        err.status=400;
        return next(err);
    }*/
  model
    .findById(id)
    .populate("author", "firstName lastName")
    .then((items) => {
      if (items) {
        user
          .findById(req.session.user)
          .then((results) => {
            const user = results;
            user.watchList.forEach((item) =>
              item.id == id ? (flag = true) : (flag = false)
            );
            console.log(flag);
            res.render("./items/show", { items, flag });
          })
          .catch((err) => next(err));
      } else {
        let err = new Error("cannot find item with id" + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};
exports.edit = (req, res, next) => {
  let id = req.params.id;
  /* if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err=new Error('Invalid item id');
        err.status=400;
        return next(err);
    }*/
  model
    .findById(id)
    .then((items) => {
      if (items) {
        res.render("./items/edit", { items });
      } else {
        let err = new Error("cannot find item with id" + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

exports.update = (req, res, next) => {
  let items = req.body;
  let id = req.params.id;
  /*if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err=new Error('Invalid item id');
        err.status=400;
        return next(err);
    }*/
  model
    .findByIdAndUpdate(id, items, {
      useFindAndModify: false,
      runValidators: true,
    })
    .then((items) => {
      if (items) {
        res.redirect("/items/" + id);
      } else {
        let err = new Error("cannot find item with id" + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
        res.redirect("back");
      }
      next(err);
    });
};
exports.delete = (req, res, next) => {
  let id = req.params.id;
  /*if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err=new Error('Invalid item id');
        err.status=400;
        return next(err);
    }*/
  model
    .findByIdAndDelete(id, { useFindAndModify: false })
    .then((items) => {
      if (items) {
        res.redirect("/items");
      } else {
        let err = new Error("cannot find item with id" + id);
        err.status = 404;
        return next(err);
      }
    })
    .catch((err) => next(err));
};
