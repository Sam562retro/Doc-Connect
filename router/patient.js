const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient")

router.get("/", async (req, res) => {
    await patSchema.findById({_id: req.session.userid}).select({password: 0, prescriptions: 0}).then(async obj => {
        if(obj.doc == "false"){
            await docSchema.find().select({password: 0, PatientReq:0, mbbs:0, mdms: 0}).then(docList => {
                res.render("dashboard", {type: "patient", subType:"patHome", docList})
            }).catch(err => {
                res.send(err)
            })
        }else{
            await docSchema.findById({_id: obj.doc}).select({password: 0, PatientReq:0, mbbs:0, mdms: 0}).then(docData => {
                res.render("dashboard", {type: "patient", subType:"patHomeDoc", docData})
            }).catch(err => {
                res.send(err)
            })
        }
    }).catch(err => {
        res.send(err)
    })
})

router.get('/book/:id', async (req, res) => {
    await docSchema.findById({_id: req.params.id}).select({password: 0, phone: 0, email: 0, location: 0, mbbs: 0, mdms: 0, PatientReq: 0}).then(docData => {
        res.render("dashboard", {type: "patient", subType: "bookDoc", docData})
    }).catch(err => {
        res.send(err)
    })
});

router.post('/book/:id', async (req, res) => {
    await patSchema.findById({_id: req.session.userid}).select({password: 0, chat: 0, doc:0, prescriptions: 0, location: 0}).then(async pat => {
        obj = [pat.name, pat.gender, pat.age, pat.phone, req.body.note, pat._id]
        await docSchema.findById(req.params.id).select({name:0, password: 0, phone: 0, email: 0, location: 0, mbbs: 0, mdms: 0, fare: 0}).then(async doc => {
            var n = doc.PatientReq
            n.push(obj)
            await docSchema.findByIdAndUpdate(req.params.id, {PatientReq: n}, {new: true}).then(ret => {
                res.redirect("/patient")
            }).catch(err => res.send(err))
        }).catch(err => res.send(err))
    }).catch(err => res.send(err))
})

router.get("/room", async (req, res) => {
    await patSchema.findById(req.session.userid).select({password: 0, prescriptions: 0}).then(async obj => {
        if(obj.room !== "false"){
            await hospSchema.findById(obj.room).select({password: 0, RoomReq: 0}).then(hospitalData => {
                res.render("dashboard", {type: "patient", subType: "hospHome", hospitalData})
            }).catch(err => {
                console.log(err)
                res.send(err)
            })
        }else{
            res.render("dashboard", {type: "patient", subType: "noHospPat"})
        }
    }).catch(err => {
        console.log(err)
        res.send(err)
    })
})

module.exports = router;