const mongoose = require('mongoose');

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

const Candidate = mongoose.model('Candidate',candidateSchema);
module.exports = Candidate;