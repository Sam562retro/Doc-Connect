const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    password:{
        required: true,
        type: String
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
        type:[[String, Boolean]],
        default:[]
    },
    location:{
        required: true,
        type: String
    },
    MBBS:{
        required: true,
        type: String
    },
    MDMS:{
        required: true,
        type: String
    }
});

module.exports = mongoose.model('doctors', docSchema);
