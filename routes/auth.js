//routes to auth users
const express = require('express')
const router = express.Router();
const { check } = require('express-validator')
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Sign up
//api/auth
router.post('/',  
    authController.userAuthentication
);

//get the auth user
router.get('/',
    auth, 
    authController.authUser)

module.exports = router;