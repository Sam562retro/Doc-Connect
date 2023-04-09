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
    }).catch(err => res.send(err))
})

router.get("/rooms/:id", (req, res) => {
    hospSchema.findById(req.params.id).then(hosp => {
        patSchema.find({doc : req.session.userid}).select({password: 0, location: 0, prescriptions :0, chat :0, email: 0, phone: 0}).then(pats => {
            res.render("dashboard", {type: "doctor", subType: "roomBook", hosp, pats})
        }).catch(err => res.send(err))
    }).catch(err => res.send(err))
})

router.post("/rooms/:id", (req, res) => {
    hospSchema.findById(req.params.id).select({name:0, password: 0, phone: 0, email: 0, roomData: 0, fare: 0, address:0, image: 0}).then(hosp => {
        docSchema.findById(req.session.userid).select({password: 0, phone: 0, email: 0, fare: 0}).then(doc => {
            var n = hosp.RoomReq
            obj = [req.body.date, req.body.time, req.body.textForPatient, doc.name, req.body.patient]
            n.push(obj)
            hospSchema.findByIdAndUpdate(req.params.id, {RoomReq: n}, {new: true}).then(ret => {
                res.redirect("/doctor/rooms")
            }).catch(err => {console.log(err);res.send(err);})
        }).catch(err => {console.log(err);res.send(err);})  
    }).catch(err => {console.log(err);res.send(err);})
})

router.get("/requests", (req, res) => {
    docSchema.findById(req.session.userid).select({name:0, password: 0, phone: 0, email: 0, location: 0, mbbs: 0, mdms: 0, fare: 0})
    .then(docData => {
        res.render("dashboard", {type:"doctor", subType: "req", patReq: docData.PatientReq})   
    }).catch(err => res.send(err))
})

router.get("/requests/accept/:index", (req, res) => {
    docSchema.findById(req.session.userid).then(docData => {
        var x = docData.PatientReq

        patSchema.findByIdAndUpdate(x[req.params.index][5], {doc: docData._id}).catch(err => {res.send(err)})
        var z = x[req.params.index]
        x = x.filter(item => item != z)

        docSchema.findByIdAndUpdate(req.session.userid, {PatientReq: x}).catch(err => {res.send(err)})
        res.redirect("/doctor/patients")

    }).catch(err => {res.send(err)})
})

router.get("/requests/reject/:index", (req, res) => {
    docSchema.findById(req.session.userid).then(docData => {
        var x = docData.PatientReq
        var z = x[req.params.index]
        x = x.filter(item => item != z)
        docSchema.findByIdAndUpdate(req.session.userid, {PatientReq: x}).catch(err => res.send(err))
        res.redirect("/doctor/requests")
    }).catch(err => {res.send(err)})
})

router.get("/patients", (req, res) => {
    patSchema.find({doc : req.session.userid}).select({password: 0, location: 0, prescriptions :0, chat :0}).then(pats => {
        res.render("dashboard", {type: "doctor", subType: "patientsDisplay", pats})
    }).catch(err => res.send(err))
})

router.get("/patients/prescription/:id", (req, res) => {
    res.render("dashboard", {type: "doctor", subType: "prescribe"})
})

router.get("/patients/chat/:id")

router.get("/patients/room/:id")

module.exports = router;