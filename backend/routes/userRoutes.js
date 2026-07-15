const user = require('../models/user');
const candidate = require('../models/candidate');
const express = require('express');
const Router = express.Router();
const {jwtAuthMiddlewareUsers,generateTokensUsers} = require('../authentication/jwtUser');
const checkAdminRole = require('../middleWare/admin');

require('dotenv').config();

//add /user in server.js:
Router.post('/signup',async (req,res)=>{
    try{
        const data = req.body;
        const newUser = new user(data);
        const response = await newUser.save();

        console.log(response);

        const userPayload = {
            id: response.id,
            userAadhar: response.AadharCard_Number
        }

        const newToken = generateTokensUsers(userPayload);

        console.log("Generated Token: ",newToken);
        console.log("Generated Payload: ",userPayload);
        
        res.status(200).json({respone:response, token:newToken});
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Error'});
    }
})

Router.post('/login', async (req, res) => {
    try {
        // BUG FIX 1: req.body ke aage se 'await' hata diya. req.body promise nahi hota.
        const { aadharNumber, password } = req.body; 
        
        const activeUser = await user.findOne({ AadharCard_Number: aadharNumber });
        if (!activeUser) {
            // Return lagana zaroori hai warna code aage chalta rahega
            return res.status(400).json({ error: 'User not found' }); 
        }
        
        const pwd = await activeUser.comparePassword(password);
        if (!pwd) {
            return res.status(400).json({ Error: 'Password error' });
        }
        
        const userPayload = {
            id: activeUser.id,
            userAadhar: activeUser.AadharCard_Number
        };
        
        // BUG FIX 2 (The Main Crash): Tune upar 'generateTokensUsers' import kiya tha, 
        // par yahan sirf 'generateTokens' likha tha. Isse ReferenceError aa raha tha!
        const newToken = generateTokensUsers(userPayload); 
        
        console.log('New Token:', newToken);
        console.log('Payload:', userPayload);
        
        res.status(200).json({ newToken: newToken });
    } catch (err) {
        console.log("Login Route Error: ", err);
        res.status(500).json({ Error: 'Internal server error' });
    }
});

Router.get('/profile', jwtAuthMiddlewareUsers, async (req, res) => {
    try {
        const activeUser = req.userInfo;
        
        // Find by database ID directly
        const userInformation = await user.findById(activeUser.id);

        if (!userInformation) {
            return res.status(404).json({ Error: 'User not found' });
        }

        res.status(200).json({ userInformation });
    } catch(err) {
        console.log("Profile Error:", err);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
});

Router.put('/:aadhar',jwtAuthMiddlewareUsers,async (req,res)=>{

    try{
        const userAadhar = req.params.id;
        const updateUserBody = req.body;
        
        if(!updateUserBody){
            console.log('Invalid Entry by user');
            res.status(400).json({Error:'Invalid Entry by user'});
        }
        const response = await user.findByIdAndUpdate(userAadhar,updateUserBody,{
            new:true,
            runValidators:true
        });
        
        console.log('Updated successfully', response);
        res.status(200).json(response);
    }catch(err){
        console.log('Caught an error');
        res.status(500).json({Error:'Internal server error'});
    }

})

Router.post('/vote', jwtAuthMiddlewareUsers, async (req, res) => {
    try {
        const { partyId } = req.body; 
        const activeUser = req.userInfo; 

        const userInformation = await user.findById(activeUser.id);

        if (!userInformation) {
            return res.status(404).json({ Error: 'User not found' });
        }

        if (userInformation.Role === 'admin') {
            return res.status(403).json({ Error: 'Admins are not allowed to vote' });
        }
        
        if (userInformation.Age < 18) {
            return res.status(403).json({ Error: 'User is not eligible to vote (must be 18+)' });
        }
        if (userInformation.Is_Voted === true) {
            return res.status(400).json({ Error: 'User has already cast their vote' });
        }

        userInformation.Is_Voted = true;
        userInformation.votedFor = partyId;

        await userInformation.save();

        //party count updation:
        const selectedCandidate = await candidate.findById(partyId);
        selectedCandidate.Vote_count += 1;
        await selectedCandidate.save();

        res.status(200).json({ Message: 'Vote cast successfully!' });

    } catch (err) {
        console.log('Error in /vote:', err);
        res.status(500).json({ Error: 'Internal server error' });
    }
});

Router.get('/viewVote', jwtAuthMiddlewareUsers, async (req, res) => {
    try {
        const activeUser = req.userInfo;
        console.log("User data (payload): ", activeUser);

        // Find by ID instead of Aadhar!
        const userInformation = await user.findById(activeUser.id);

        if (!userInformation) {
             return res.status(404).json({ Error: 'User not found' });
        }

        res.status(200).json({ 
            userName: userInformation.Name,
            // Make sure 'votedFor' matches whatever you named it in your Schema!
            votedTo: userInformation.Voted_to 
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
});

module.exports = Router;