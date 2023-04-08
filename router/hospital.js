const express = require('express');
const router = express.Router();

const docSchema = require("./../model/doctor")
const hospSchema = require("./../model/hospital")
const patSchema = require("./../model/patient")

router.get("/")

router.get("/edit")

router.get("/requests")

module.exports = router;