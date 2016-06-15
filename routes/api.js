"use strict";

var express = require("express");
var router = express.Router();

// router.use("/users", require("./users"));
router.use("/twilio", require("./twilio"));
router.use("/applications", require("./applications"));

module.exports = router;
