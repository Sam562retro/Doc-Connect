const mongoose = require('mongoose');

const hospSchema = new mongoose.Schema({
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
    RoomReq:{
        required: true,
        type:[[String, String, String, String, String]],
        default:[]
    },
    roomData:{
        required:true,
        type: String
    },
    address:{
        required: true,
        type: String
    },
    image:{
        required: true,
        type: String
    },
    fare:{
        required: true,
        type: Number
    }
});

module.exports = mongoose.model('hospitals', hospSchema);