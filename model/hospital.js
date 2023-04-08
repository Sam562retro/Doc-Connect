const mongoose = require('mongoose');

const hospSchema = new mongoose.Schema({
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
    RoomReq:{
        required: true,
        type:[[String, Boolean]],
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
    }
});

module.exports = mongoose.model('hospitals', hospSchema);