const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient")

router.get("/")

router.get("/rooms")

router.get("/rooms/:id")

router.get("/requests")

router.get("/patients")

router.get("/patients/:id")

router.get("/patients/:id/chat")

router.get("/patients/:id/prescription")

router.get("/patients/:id/room")

module.exports = router;