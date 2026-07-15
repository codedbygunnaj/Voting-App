const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
    },
    Voted_to:{
        type:String,
        default:null
    }
})

userSchema.pre('save',async function(){
    const activeUser = this;
    
    //we'll hash the password If: a) new b) modified

    if(!activeUser.isModified('Password')) return;
    
    try{
        const salt = await bcrypt.genSalt(10);
        const updatedPwd = await bcrypt.hash(activeUser.Password,salt);
        
        activeUser.Password = updatedPwd;
    }catch(err){
        return err;
    } 
})

userSchema.methods.comparePassword = async function(pwd){
    try{
        const isAMatch = bcrypt.compare(pwd,this.Password);
        return isAMatch;
    }catch(err){
        throw err;
    }
}

const User = mongoose.model('User',userSchema);
module.exports = User;