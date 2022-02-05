const User = require('../models/User');
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {
    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    
    const {email, password} = req.body;
    
    try {

        //validating unique user
        let user = await User.findOne({email});

        if(user) {
            return res.status(400).json({msg: 'The user already exists'})
        }

        //create new user
        user = new User(req.body);

        //encrypt password - hash password
        // the salt creates and unique hash even when the passwords are the same
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt)

        //save new user
        await user.save()

        //create and sign JWT
        const payload = {
            user: {
                id: user.id
            }

        }

        jwt.sign(payload, process.env.SECRET,{
            expiresIn: 3600 //1 hour
        }, (error,token)=> {
            if(error) throw error;
            res.json({token})

        })



    } catch (error) {
        console.log(error)
        res.status(400).send('There is a mistake')

    }  
}