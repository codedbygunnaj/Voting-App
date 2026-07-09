const express = require('express');
const user = require('../models/user');

const checkAdminRole = async function(req,res,next){
    try{
        const activeUser = req.userInfo;
        const userInformation = await user.findById(activeUser.id);

        if (userInformation.Role !== 'admin') {
            return res.status(403).json({ Error: 'Access denied. Admin privileges required.' });
        }
        next(); // User is an admin, proceed to the route!

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
}

module.exports = checkAdminRole;