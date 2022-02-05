const User = require('../models/User');
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')

exports.userAuthentication = async (req, res) => {

    const errors = validationResult(req);

    
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }


    const {email, password} = req.body;

    try{
        //check whether the user exists or not
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:'User does not exist'});
        }

        //check password
        const correctPassword = await bcryptjs.compare(password, user.password)
        if(!correctPassword) {
            return res.status(400).json({msg: 'Incorrect password'})
        }

        // if email and password are correct
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

    } catch(error) {
        console.log(error)
    }
    
}

// get the user that is auth
exports.authUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json({user})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'There is a mistake'})
    }
}