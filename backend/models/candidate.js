const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const candidateSchema = new mongoose.Schema({
    Name:{
        type: String,
        required: true
    },
    Party:{
        type:String,
        required:true,
        unique:true
    },
    Party_Id:{
        type:String,
        required:true,
        unique:true
    },
    Age_Of_Contender:{
        type:Number,
        required:true
    },
    AadharCard_Number:{
        type:Number,
        required:true,
        unique:true
        //citizenShip verification:
    },
    Password:{
        type:String,
        required:true,
    },
    Votes:{
        type:[
            {
                User:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User',
                    required:true
                },
                Voted_at:{
                    type:Date,
                    default:Date.now()
                }
            }
        ]
    },
    Vote_count:{
        type:Number,
        default:0
    }
})


candidateSchema.pre('save', async function(){
    const activeCandidate = this;
    
    // we'll hash the password If: a) new b) modified
    if(!activeCandidate.isModified('Password')) return;
    
    try{
        const salt = await bcrypt.genSalt(10);
        const updatedPwd = await bcrypt.hash(activeCandidate.Password, salt);
        
        activeCandidate.Password = updatedPwd;
    }catch(err){
        throw err; 
    } 
});

candidateSchema.methods.comparePassword = async function(pwd){
    try{
        // BUG FIX 2: Yahan 'await' missing tha.
        const isAMatch = await bcrypt.compare(pwd, this.Password);
        return isAMatch;
    }catch(err){
        throw err;
    }
};

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;