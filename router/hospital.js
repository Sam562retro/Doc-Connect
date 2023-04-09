const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient")

router.get("/", async (req, res) => {
    await hospSchema.find({_id: req.session.userid}).select({password: 0, RoomReq: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"hospHome", hospitalData: hospitalData[0]})
    })
})

router.get("/edit", async (req, res) => {
    await hospSchema.findById(req.session.userid).select({password: 0, RoomReq: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"editHosp", hospitalData})
    })
})

router.post("/edit", async (req, res) => {
    await hospSchema.findByIdAndUpdate(req.session.userid, {phone: req.body.phone, email: req.body.email, fare: req.body.fare, roomData: req.body.roomData}, {new: true}).then(ret => {
        res.redirect("/hospital")
    }).catch(err => {console.log(err); res.redirect('/hospital/edit')})
})

router.get("/requests", async (req, res) => {
    await hospSchema.findById(req.session.userid).select({name:0, password: 0, phone:0, email: 0, roomData: 0, address: 0, image:0, fare: 0}).then(hospitalData => {
        res.render("dashboard", {type: "hospital", subType:"hospRequests", roomReq: hospitalData.RoomReq})
    })
})

router.get("/requests/accept/:index", async (req, res) => {
    await hospSchema.findById(req.session.userid).then(async hosp => {
        var x = hosp.RoomReq
        await patSchema.findByIdAndUpdate(x[req.params.index][4], {room: hosp._id}).catch(err => {res.send(err)})
        var z = x[req.params.index]
        x = x.filter(item => item != z)
        await hospSchema.findByIdAndUpdate(req.session.userid, {RoomReq: x}).catch(err => {res.send(err)})
        res.redirect("/hospital/requests")

    }).catch(err => {res.send(err)})
})

router.get("/requests/reject/:index", async (req, res) => {
    await hospSchema.findById(req.session.userid).then(async hosp => {
        var x = hosp.RoomReq
        var z = x[req.params.index]
        x = x.filter(item => item != z)
        await hospSchema.findByIdAndUpdate(req.session.userid, {RoomReq: x}).catch(err => {res.send(err)})
        res.redirect("/hospital/requests")
    }).catch(err => {res.send(err)})
})

module.exports = router;