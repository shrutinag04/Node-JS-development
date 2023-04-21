const { nextTick } = require("process");
const model = require("../models/items");
const { isLoggedIn } = require("../middlewares/auth");
const { watch } = require("fs/promises");
const items = require("../models/items");
const trade = require("../models/trade");
const user = require("../models/user");

const { PerformanceNodeTiming } = require("perf_hooks");
exports.watch = (req, res, next) => {
  let productId = req.params.id;
  let productWatch = "";

  user
    .updateOne({ _id: req.session.user }, { $push: { watchList: productId } })
    .then((response) => {
      req.flash("success", " added to watchlist");
      res.redirect("/users/profile");
    })
    .catch((err) => next(err));
};
exports.unwatch = (req, res, next) => {
  let productId = req.params.id;
  // let productWatch = req.body.productWatch;
  user
    .findById(req.session.user)
    .then((response) => {
      user
        .updateOne(
          { _id: req.session.user },
          { $pull: { watchList: productId } }
        )
        .then(() => {
          req.flash("success", "removed from watchlist.");
          res.redirect("/users/profile");
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.trade = (req, res, next) => {
  let id = req.params.id;
  let userid = req.session.user;
  /*  if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err=new Error('Invalid item id');
        err.status=400;
        return next(err);
    }*/

  model
    .find({ author: userid })
    .then((items) => {
      if (items) {
        model
          .findById(id)
          .populate("author", "firstName lastName")
          .then((offeringItem) => {
            //console.log(offeringItem);
            //console.log(offeringItem.author.firstName);

            res.render("./items/trade", { items, offeringItem });
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

exports.tradeSaver = (req, res, next) => {
  let id = req.params.id;
  let newid = req.body;
  let userid = req.session.user;
  let tempVal = newid.selectedTrade;
  model
    .findById(id)
    .populate("author", "firstName")
    .then((wantedItems) => {
      model
        .findById(tempVal)
        .populate("author", "firstName")
        .then((offeredItems) => {
          let createdTrade = {
            offeredItem: offeredItems.name,
            wantedItem: wantedItems.name,
            offered_user: offeredItems.author.firstName,
            wanted_user: wantedItems.author.firstName,
            offeredItemStatus: "pending",
            wantedItemStatus: "pending",
            offeredItemCategory: offeredItems.category,
            wantedItemCategory: wantedItems.category,
            offeredId: offeredItems.id,
            wantedId: wantedItems.id,

            accepted: true,
          };
          console.log(createdTrade);
          new trade(createdTrade).save();
          offeredItems.status = "pending";
          wantedItems.status = "pending";
          offeredItems.save();
          wantedItems.save();
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));

  model
    .find({ author: userid })
    .then((item) => {
      trade
        .find()
        .then((tradeItems) => {
          if (item) {
            //  console.log(items);
            // console.log(tradeItems);
            Promise.all([items.find(), user.findById(userid)])
              .then((results) => {
                const [items, user] = results;
                res.render("./user/profile", {
                  items,
                  user,
                  tradeItems,
                });
                //console.log(results);
              })
              .catch((err) => next(err));
          } else {
            let err = new Error("cannot find item with id" + id);
            err.status = 404;
            next(err);
          }
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

exports.tradeRemover = (req, res, next) => {
  console.log("inside remover");
  let offeredIdtemp = req.params.id;
  let userid = req.session.user;
  let wantedId = req.params.id1;
  console.log(offeredIdtemp);
  console.log(wantedId);

  /*if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err=new Error('Invalid item id');
        err.status=400;
        return next(err);
    }*/
  items
    .find({ author: userid })
    .then((items) => {
      if (items) {
        trade
          .findOneAndDelete(
            { offeredId: offeredIdtemp },
            { useFindAndModify: false }
          )
          .then((response) => {
            trade
              .find()
              .then((tradeItems) => {
                model
                  .findById(offeredIdtemp)
                  .then((item) => {
                    item.status = "available";
                    item.save();
                  })
                  .catch((err) => next(err));
                model
                  .findById(wantedId)
                  .then((item) => {
                    item.status = "available";
                    item.save();
                  })
                  .catch((err) => next(err));
                user.findById(userid).then((user) => {
                  res.render("./user/profile", {
                    items,
                    tradeItems,
                    user,
                  });
                });
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      } else {
        let err = new Error("cannot find item with id" + id);
        err.status = 404;
        return next(err);
      }
    })
    .catch((err) => next(err));
};

exports.manageOffer = (req, res, next) => {
  console.log("inside manageoffer");
  let userid = req.session.user;
  let wantedIdtemp = req.params.id1;
  let offeredId = req.params.id;
  console.log(wantedIdtemp); //idgaf
  console.log(offeredId); //treatubetter

  /*if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err=new Error('Invalid item id');
        err.status=400;
        return next(err);
    }*/
  items
    .findById(wantedIdtemp)
    .populate("author", "firstName")
    .then((item) => {
      if (item) {
        trade
          .findOne({ offeredId: offeredId }, { useFindAndModify: false })
          .then((tradeItem) => {
            user
              .findById(userid)
              .then((user) => {
                console.log(item);
                console.log(tradeItem);
                res.render("./items/offer", { item, tradeItem, user });
              })
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      } else {
        let err = new Error("cannot find item with id" + id);
        err.status = 404;
        return next(err);
      }
    })
    .catch((err) => next(err));
};
