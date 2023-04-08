const mongoose = require('mongoose');

const patSchema = new mongoose.Schema({
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
    age:{
        required: true,
        type: Number
    },
    gender:{
        required: true,
        type: String
    },
    chat:{
        required: true,
        type: [[String, String]],
        default: []
    },
    doc:{
        required: true,
        type: String,
        default: false
    },
    prescriptions:{
        required: true,
        type: [[[String, String]]],
        default: []
    }
});

module.exports = mongoose.model('patients', patSchema);