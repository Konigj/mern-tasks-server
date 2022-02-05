//routes to create users
const express = require('express')
const router = express.Router();
const userController = require('../controllers/userController.js')
const { check } = require('express-validator')


//Create User
router.post('/', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Add a valid email').isEmail(),
        check('password', 'The password must have 6 characters').isLength({min: 6})
    ],
    userController.createUser
);



module.exports = router;