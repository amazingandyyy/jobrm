"use strict";

var express = require("express");
var router = express.Router();

router.use("/twilio", require("./twilio"));
router.use("/users", require("./users"));
router.use("/applications", require("./applications"));
router.use("/gmailAPI", require("./gmailAPI"));

module.exports = router;
