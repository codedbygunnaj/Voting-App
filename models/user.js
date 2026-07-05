const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    Date_of_Birth:{
        type: Date,
        required: true
    },
    Age:{
        type: Number,
        required: true
    },
    Gender:{
        type:String,
        required: true
    },
    Email_id:{
        type:String
    },
    Mobile:{
        type:String
    },
    Address:{
        type:String,
        required:true
    },
    AadharCard_Number:{
        type:Number,
        unique:true,
        required:true
    },
    Password:{
        type:String,
        required:true,
    },
    Role:{
        type:String,
        enum:['admin','voter'],
        default:'voter'
    },
    Is_Voted:{
        type:Boolean,
        default:false
    }
})

const User = mongoose.model('User',userSchema);
module.exports = User;