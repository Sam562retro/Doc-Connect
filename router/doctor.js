const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient");
const patient = require('./../model/patient');

router.get("/", (req, res) => {
    res.render("dashboard", {type: "doctor", subType:"docHome"})
})

router.get("/rooms", (req, res) => {
    hospSchema.find({}).select({password: 0, RoomReq: 0}).then(obj => {
        res.render("dashboard", {type: "doctor", subType:"roomBrowse", hospData: obj})
    })
})

router.get("/rooms/:id")

router.get("/requests", (req, res) => {
    docSchema.findById(req.session.userid).select({name:0, password: 0, phone: 0, email: 0, location: 0, mbbs: 0, mdms: 0, fare: 0})
    .then(docData => {
        res.render("dashboard", {type:"doctor", subType: "req", patReq: docData.PatientReq})   
    })
})

router.get("/doctor/requests/accept/:index", (req, res) => {
    docSchema.findById(req.session.userid).then(docData => {
        var x = docData.PatientReq
        var y = x[req.params.index]
        
        patSchema.findByIdAndUpdate(x[5], {doc: docData._id}).catch(err => {res.send(err)})
    })
})

router.get("/doctor/requests/reject/:index", (req, res) => {
    
})

router.get("/patients")

router.get("/patients/:id/chat")

router.get("/patients/:id/prescription")

router.get("/patients/:id/room")

module.exports = router;