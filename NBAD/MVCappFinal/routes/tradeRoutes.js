const express = require("express");
const router = express.Router();
const controller = require("../controllers/tradeController");
const { isLoggedIn, isAuthor } = require("../middlewares/auth");
const {
  validateId,
  validateItem,
  validateResult,
} = require("../middlewares/validator");

router.get("/:id/watch", validateId, isLoggedIn, controller.watch);
router.get("/:id/unwatch", isLoggedIn, controller.unwatch);
router.get("/:id/trade", validateId, isLoggedIn, controller.trade);
router.post("/:id/trade", validateId, isLoggedIn, controller.tradeSaver);
router.post(
  "/:id/trade/:id1",
  validateId,
  isLoggedIn,
  isAuthor,
  controller.tradeRemover
);
router.get(
  "/:id/offer/:id1",
  validateId,
  isLoggedIn,
  isAuthor,
  controller.manageOffer
);

module.exports = router;
