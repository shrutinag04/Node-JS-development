const express = require("express");
const router = express.Router();
const controller = require("../controllers/itemsController");
const { isLoggedIn, isAuthor } = require("../middlewares/auth");
const {
  validateId,
  validateItem,
  validateResult,
} = require("../middlewares/validator");

//GET /items:send all items to the user
router.get("/", controller.index);
//GET /items/new: send html form for creatig a new item
router.get("/new", isLoggedIn, controller.new);
//About
router.get("/about", controller.about);
router.get("/contact", controller.contact);
//GET /items/:id: send details of item identified by id
router.get("/:id", validateId, controller.show);
//POST /items:create a new item
router.post("/", isLoggedIn, validateItem, validateResult, controller.create);
//GET /items/:id/edit: send html form for editing an existing item
router.get("/:id/edit", validateId, isLoggedIn, isAuthor, controller.edit);
//PUT /items/:id: update the item identified by id
router.put(
  "/:id",
  validateId,
  isLoggedIn,
  validateItem,
  validateResult,
  controller.update
);
//GET /items/:id/edit: send html form for editing an existing item

//GET /items/:id/edit: send html form for editing an existing item

//DELETE /items/:id delete the item identified by id
router.delete("/:id", validateId, isLoggedIn, isAuthor, controller.delete);

module.exports = router;
