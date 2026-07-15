const express =  require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');
const db = require('./database/db');
const userRoutes = require('./routes/userRoutes'); 
const candidateRoutes = require('./routes/candidateRoutes');

const App = express();
require('dotenv').config();

App.use(cors());
App.use(bodyParser.json());

App.use('/user', userRoutes);
App.use('/candidate', candidateRoutes);

let PORT = process.env.PORT_NO || 3000;

App.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}...`);
});