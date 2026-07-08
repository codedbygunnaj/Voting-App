const user = require('../models/user');
const candidate = require('../models/candidate');
const express = require('express');
const Router = express.Router();
const {jwtAuthMiddlewareUsers,generateTokensUsers} = require('../authentication/jwtUser');

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

Router.post('/login', async (req,res)=>{
    try{
        const {aadharNumber,password}= await req.body;
        const activeUser = await user.findOne({AadharCard_Number: aadharNumber});
        if(!activeUser) {
            res.status(400).json({error:'User not found'});
            return;
        }
        const pwd = await activeUser.comparePassword(password);
        if(!pwd){
            res.status(400).json({Error:'Password error'});
            return;
        }
        const userPayload = {
            id: activeUser.id,
            userAadhar: activeUser.AadharCard_Number
        }
        const newToken = generateTokens(userPayload)
        
        console.log('New Token:',newToken)
        console.log('Payload:',userPayload)
        
        res.status(200).json({newToken:newToken});
    }catch(err){
        console.log(err);
        res.status(500).json({Error: 'Internal server error'});
    }
})

Router.get('/profile',jwtAuthMiddleware,async (req,res)=>{

    try{
        const activeUser = req.userInfo;
        console.log("User data (payload): ",user);

        const aadharNumber = activeUser.aadharNumber;
        const userInformation = await user.findOne({AadharCard_Number:aadharNumber});

        res.status(200).json({userInformation});
    }catch(err){
        console.log(err);
        res.status(500).json({Error:'Internal Server Error'});
    }

})

Router.put('/:aadhar',jwtAuthMiddleware,async (req,res)=>{

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