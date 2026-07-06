const jwt = require('jsonwebtoken');
const user = require('../models/candidate');
require('dotenv').config();

const jwtAuthMiddlewareCandidates = (req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1];
    if(!token) res.status(401).json({Error: 'Candidate not authorized'});

    try{
        const decodedPayload = jwt.verify(token,`${process.env.SECRET_KEY_CANDIDATE}`);
        //attach user information to request object -> new key added to req
        req.userInfo = decodedPayload;
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({Error:'Unauthorized'});
    }

}

const generateTokensCandidates = function(candidatePayload){
    return jwt.sign({candidatePayload},`${process.env.SECRET_KEY_CANDIDATE}`,{expiresIn:'1y'})
}

module.exports = {jwtAuthMiddlewareCandidates,generateTokensCandidates}