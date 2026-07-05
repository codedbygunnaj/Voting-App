const express =  require('express');
const bodyParser = require('body-parser'); 
// const db = require('../database/db');
const Candidate = require('../models/candidate');
const User = require('../models/user')

const App = express();
require('dotenv').config();
App.use(bodyParser.json());
let PORT = process.env.PORT_NO

App.listen(PORT, ()=>{
    console.log("Welcome to voting app, an interface designed to study the process of voting alongwith realtime vote updates sorted according to the candidate's votes.")
});