"use strict";

var express = require("express");
var router = express.Router();

router.use("/users", require("./users"));
router.use("/sendmail", require("./sendmail"));
router.use("/applications", require("./applications"));

module.exports = router;
