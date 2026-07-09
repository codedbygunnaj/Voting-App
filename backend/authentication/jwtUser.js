const jwt = require('jsonwebtoken');
const user = require('../models/user');
require('dotenv').config();

const jwtAuthMiddlewareUsers = (req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1];
    if(!token) res.status(401).json({Error: 'User not authorized'});

    try{
        const decodedPayload = jwt.verify(token,`${process.env.SECRET_KEY_USER}`);
        //attach user information to request object -> new key added to req
        req.userInfo = decodedPayload;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({Error:'Unauthorized'});
    }

}

const generateTokensUsers = function(userPayload){
    return jwt.sign(userPayload,`${process.env.SECRET_KEY_USER}`,{expiresIn:'1y'})
}

module.exports = {jwtAuthMiddlewareUsers,generateTokensUsers}