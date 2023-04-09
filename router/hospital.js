const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient")

router.get("/", (req, res) => {
    hospSchema.find({_id: req.session.userid}).select({password: 0, RoomReq: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"hospHome", hospitalData: hospitalData[0]})
    })
})

router.get("/edit", (req, res) => {
    hospSchema.find({_id: req.session.userid}).select({password: 0, RoomReq: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"hospEdit", hospitalData})
    })
})

router.get("/requests", (req, res) => {
    hospSchema.findById(req.session.userid).select({name:0, password: 0, phone:0, email: 0, roomData: 0, address: 0, image:0, fare: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"hospRequests", roomReq: hospitalData.RoomReq})
    })
})

router.get("/requests/accept/:index", (req, res) => {
    hospSchema.findById(req.session.userid).then(hosp => {
        var x = hosp.RoomReq
        patSchema.findByIdAndUpdate(x[req.params.index][4], {room: hosp._id}).catch(err => {res.send(err)})
        var z = x[req.params.index]
        x = x.filter(item => item != z)
        hospSchema.findByIdAndUpdate(req.session.userid, {RoomReq: x}).catch(err => {res.send(err)})
        res.redirect("/hospital/requests")

    }).catch(err => {res.send(err)})
})

router.get("/requests/reject/:index", (req, res) => {
    hospSchema.findById(req.session.userid).then(hosp => {
        var x = hosp.RoomReq
        var z = x[req.params.index]
        x = x.filter(item => item != z)
        hospSchema.findByIdAndUpdate(req.session.userid, {RoomReq: x}).catch(err => {res.send(err)})
        res.redirect("/hospital/requests")
    }).catch(err => {res.send(err)})
})

module.exports = router;