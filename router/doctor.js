const express = require('express');
const router = express.Router();

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