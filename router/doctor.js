const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient");
const patient = require('./../model/patient');

router.get("/", (req, res) => {
    res.render("dashboard", {type: "doctor", subType:"docHome"})
})

router.get("/rooms", async (req, res) => {
    await hospSchema.find({}).select({password: 0, RoomReq: 0}).then(obj => {
        res.render("dashboard", {type: "doctor", subType:"roomBrowse", hospData: obj})
    }).catch(err => res.send(err))
})

router.get("/rooms/:id", async (req, res) => {
    await hospSchema.findById(req.params.id).then(async hosp => {
        await patSchema.find({doc : req.session.userid}).select({password: 0, location: 0, prescriptions :0, chat :0, email: 0, phone: 0}).then(pats => {
            res.render("dashboard", {type: "doctor", subType: "roomBook", hosp, pats})
        }).catch(err => res.send(err))
    }).catch(err => res.send(err))
})

router.post("/rooms/:id", async (req, res) => {
    await hospSchema.findById(req.params.id).select({name:0, password: 0, phone: 0, email: 0, roomData: 0, fare: 0, address:0, image: 0}).then(async hosp => {
        await docSchema.findById(req.session.userid).select({password: 0, phone: 0, email: 0, fare: 0}).then(async doc => {
            var n = hosp.RoomReq
            obj = [req.body.date, req.body.time, req.body.textForPatient, doc.name, req.body.patient]
            n.push(obj)
            await hospSchema.findByIdAndUpdate(req.params.id, {RoomReq: n}, {new: true}).then(ret => {
                res.redirect("/doctor/rooms")
            }).catch(err => {console.log(err);res.send(err);})
        }).catch(err => {console.log(err);res.send(err);})  
    }).catch(err => {console.log(err);res.send(err);})
})

router.get("/requests", async (req, res) => {
    await docSchema.findById(req.session.userid).select({name:0, password: 0, phone: 0, email: 0, location: 0, mbbs: 0, mdms: 0, fare: 0})
    .then(docData => {
        res.render("dashboard", {type:"doctor", subType: "req", patReq: docData.PatientReq})   
    }).catch(err => res.send(err))
})

router.get("/requests/accept/:index", async (req, res) => {
    await docSchema.findById(req.session.userid).then(async docData => {
        var x = docData.PatientReq

        await patSchema.findByIdAndUpdate(x[req.params.index][5], {doc: docData._id}).catch(err => {res.send(err)})
        var z = x[req.params.index]
        x = x.filter(item => item != z)

        await docSchema.findByIdAndUpdate(req.session.userid, {PatientReq: x}).catch(err => {res.send(err)})
        res.redirect("/doctor/patients")

    }).catch(err => {res.send(err)})
})

router.get("/requests/reject/:index", async (req, res) => {
    await docSchema.findById(req.session.userid).then(async docData => {
        var x = docData.PatientReq
        var z = x[req.params.index]
        x = x.filter(item => item != z)
        await docSchema.findByIdAndUpdate(req.session.userid, {PatientReq: x}).catch(err => res.send(err))
        res.redirect("/doctor/requests")
    }).catch(err => {res.send(err)})
})

router.get("/patients", async (req, res) => {
    await patSchema.find({doc : req.session.userid}).select({password: 0, location: 0, prescriptions :0, chat :0}).then(pats => {
        res.render("dashboard", {type: "doctor", subType: "patientsDisplay", pats})
    }).catch(err => res.send(err))
})

router.get("/patients/chat/:id")

router.get("/patients/room/:id", async (req, res) => {
    await patSchema.findById(req.params.id).then(async pat => {
        if(pat.room !== "false"){
            await hospSchema.findById(pat.room).then(hospitalData => {
                res.render("dashboard", {type: "doctor", subType: "hospHome", hospitalData})
            }).catch(err => {
                console.log(err)
                res.send(err)
            })
        }else{
            res.render("dashboard", {type: "doctor", subType: "noHospDoc"})
        }
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
})

module.exports = router;