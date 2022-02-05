const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //read token's header
    const token = req.header('x-auth-token');

    //check if there is no token
    if(!token){
        return res.status(401).json({msg:'No token, invalid authorization'})
    }

    //token validation

    try {
        const encrypted = jwt.verify(token, process.env.SECRET);
        req.user = encrypted.user
        next()
    
    } catch (error) {
        res.status(401).json({msg: 'Invalid token'})
    }
}