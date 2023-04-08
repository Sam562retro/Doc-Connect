const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient")

router.get("/")

router.get("/chat")

router.get("/prescription")

router.get("/room")

router.get("/self-diagnose")


module.exports = router;