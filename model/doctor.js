const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String,
        unique: true
    },
    phone:{
        required: true,
        type: Number
    },
    email:{
        required: true,
        type: String
    },
    PatientReq:{
        required: true,
        type:[[String, String, Number, String]],
        default:[]
    },
    location:{
        required: true,
        type: [String]
    },
    mbbs:{
        required: true,
        type: String
    },
    mdms:{
        required: true,
        type: String
    }, 
    fare:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('doctors', docSchema);
