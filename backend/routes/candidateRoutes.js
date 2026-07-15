const express = require('express');
const Router = express.Router();
const Candidate = require('../models/candidate');
const { jwtAuthMiddlewareCandidates, generateTokensCandidates } = require('../authentication/jwtCandidate');
const checkAdminRole = require('../middleWare/admin');

Router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        
        // Reminder: If candidates log in, you must add a password field to the schema and hash it here!
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();

        console.log('Candidate created:', response);

        const candidatePayload = {
            id: response.id,
            candidateAadhar: response.AadharCard_Number
        };

        const newToken = generateTokensCandidates(candidatePayload);
        
        res.status(200).json({ response: response, token: newToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'Error creating candidate' });
    }
});

// routes/candidateRoutes.js ke andar login route:

Router.post('/login', async (req, res) => {
    try {
        const { aadharNumber, password } = req.body; 
        
        const activeCandidate = await Candidate.findOne({ AadharCard_Number: aadharNumber });
        
        // BUG FIX 1: Yahan pehle 'activeUser' likha tha, usko 'activeCandidate' kiya
        if (!activeCandidate) {
            return res.status(400).json({ error: 'Candidate not found' });
        }
        
        const pwd = await activeCandidate.comparePassword(password);
        if (!pwd) {
            return res.status(400).json({ Error: 'Password error' });
        }
        
        // BUG FIX 2: 'response.id' ki jagah 'activeCandidate.id' use kiya
        const candidatePayload = {
            id: activeCandidate.id,
            candidateAadhar: activeCandidate.AadharCard_Number
        };

        // BUG FIX 3: generateTokensCandidates use kiya aur sahi payload pass kiya
        const newToken = generateTokensCandidates(candidatePayload);
        
        console.log('Candidate Login Token:', newToken);
        
        res.status(200).json({ newToken: newToken });
    } catch (err) {
        console.log("Candidate Login Error: ", err);
        res.status(500).json({ Error: 'Internal server error' });
    }
});

Router.get('/list', async (req, res) => {
    try {
        // We only return names and parties, we don't need to expose their Aadhar or exact voters
        const candidates = await Candidate.find({}, 'Name Party Party_Id Vote_count');
        res.status(200).json(candidates);
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
});

Router.get('/profile', jwtAuthMiddlewareCandidates, async (req, res) => {
    try {
        const activeCandidate = req.userInfo;
        
        // Find candidate by the ID in the token payload
        const candidateInfo = await Candidate.findById(activeCandidate.id);
        
        if (!candidateInfo) {
            return res.status(404).json({ Error: 'Candidate not found' });
        }

        res.status(200).json({
            Name: candidateInfo.Name,
            Party: candidateInfo.Party,
            Total_Votes: candidateInfo.Vote_count
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ Error: 'Internal Server Error' });
    }
});

// 4. PUT: Update candidate details
Router.put('/:candidateId', jwtAuthMiddlewareCandidates, async (req, res) => {
    try {
        const candidateId = req.params.candidateId;
        const updateCandidateBody = req.body;
        
        const response = await Candidate.findByIdAndUpdate(candidateId, updateCandidateBody, {
            new: true,
            runValidators: true
        });
        
        if (!response) {
            return res.status(404).json({ Error: 'Candidate not found' });
        }

        console.log('Candidate updated successfully');
        res.status(200).json(response);
    } catch (err) {
        console.log('Error updating candidate:', err);
        res.status(500).json({ Error: 'Internal server error' });
    }
});

// 5. DELETE: Remove a candidate
Router.delete('/:candidateId', jwtAuthMiddlewareCandidates, checkAdminRole, async (req, res) => {
    try {
        const candidateId = req.params.candidateId;
        
        const response = await Candidate.findByIdAndDelete(candidateId);
        
        if (!response) {
            return res.status(404).json({ Error: 'Candidate not found' });
        }

        console.log('Candidate deleted successfully');
        res.status(200).json({ Message: 'Candidate deleted successfully' });
    } catch (err) {
        console.log('Error deleting candidate:', err);
        res.status(500).json({ Error: 'Internal server error' });
    }
});

module.exports = Router;