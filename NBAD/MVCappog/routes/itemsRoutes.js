const express=require('express');
const router=express.Router();
const controller=require('../controllers/itemsController')
//GET /items:send all items to the user
router.get('/',controller.index);
//GET /items/new: send html form for creatig a new item
router.get('/new',controller.new);
//About 
router.get('/about',controller.about);
router.get('/contact',controller.contact);
//GET /items/:id: send details of item identified by id
router.get('/:id',controller.show);
//POST /items:create a new item
router.post('/',controller.create);
//GET /items/:id/edit: send html form for editing an existing item
router.get('/:id/edit',controller.edit);
//PUT /items/:id: update the item identified by id
router.put('/:id',controller.update);
//DELETE /items/:id delete the item identified by id
router.delete('/:id',controller.delete);



module.exports=router;