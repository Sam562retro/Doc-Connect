const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient")

router.get("/", (req, res) => {
    patSchema.findById({_id: req.session.userid}).select({password: 0, prescriptions: 0}).then(obj => {
        if(obj.doc == "false"){
            docSchema.find().select({password: 0, PatientReq:0, mbbs:0, mdms: 0}).then(docList => {
                res.render("dashboard", {type: "patient", subType:"patHome", docList})
            }).catch(err => {
                res.send(err)
            })
        }else{
            docSchema.findById({_id: obj.doc}).select({password: 0, PatientReq:0, mbbs:0, mdms: 0}).then(docData => {
                res.render("dashboard", {type: "patient", subType:"patHomeDoc", docData})
            }).catch(err => {
                res.send(err)
            })
        }
    }).catch(err => {
        res.send(err)
    })
})

router.get('/book/:id', (req, res) => {
    docSchema.findById({_id: req.params.id}).select({password: 0, phone: 0, email: 0, location: 0, mbbs: 0, mdms: 0, PatientReq: 0}).then(docData => {
        res.render("dashboard", {type: "patient", subType: "bookDoc", docData})
    }).catch(err => {
        res.send(err)
    })
});

router.post('/book/:id', (req, res) => {
    patSchema.findById({_id: req.session.userid}).select({password: 0, chat: 0, doc:0, prescriptions: 0, location: 0}).then(pat => {
        obj = [pat.name, pat.gender, pat.age, req.body.note]
        docSchema.findById(req.params.id).select({name:0, password: 0, phone: 0, email: 0, location: 0, mbbs: 0, mdms: 0, fare: 0}).then(doc => {
            var n = doc.PatientReq
            n.push(obj)
            docSchema.findByIdAndUpdate(req.params.id, {PatientReq: n}, {new: true}).then(ret => {
                res.redirect("/patient")
            }).catch(err => res.send(err))
        }).catch(err => res.send(err))
    }).catch(err => res.send(err))
})

router.get("/chat")

router.get("/prescription")

router.get("/room")

module.exports = router;