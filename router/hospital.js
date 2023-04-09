const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient")

router.get("/", (req, res) => {
    hospSchema.find({_id: req.session.userid}).select({password: 0, RoomReq: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"hospHome", hospitalData})
    })
})

router.get("/edit", (req, res) => {
    hospSchema.find({_id: req.session.userid}).select({password: 0, RoomReq: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"hospEdit", hospitalData})
    })
})

router.get("/requests", (req, res) => {
    hospSchema.find({_id: req.session.userid}).select({name:0, password: 0, phone:0, email: 0, roomData: 0, address: 0, image:0, fare: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"hospHome", hospitalData})
    })
})

module.exports = router;