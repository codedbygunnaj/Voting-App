const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

//adding mongodb url
const mongoURL = `${process.env.MONGO_URL_ATLAS}`;

//setting up mongodb connection:
mongoose.connect(mongoURL)

//creating mongodb connection object:
const db = mongoose.connection;

//creating event listeners for db:
db.on('connected',()=>{
    console.log('Connected to mongodb server')
})
db.on('error',()=>{
    console.log('Error occured while connecting with mongodb server')
})
db.on('disconnected',()=>{
    console.log('DisConnected from mongodb server')
})

//exporting the database object
module.exports = db;