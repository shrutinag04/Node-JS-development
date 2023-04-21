const express = require('express');
const controller = require('../controllers/userController');
const router = express.Router();


//GET /users/new: send html form for creating a new user

router.get('/new', controller.new);
//POST /users: create a new user

router.post('/', controller.create);
//POST /users: login

router.get('/login', controller.login);

//POST /users: login process

router.post('/login', controller.loginProcess);

//GET /users/profile send details of user identified by id
router.get('/profile', controller.profile);

//GET /users/logout 
router.get('/logout', controller.logout);



module.exports = router;


