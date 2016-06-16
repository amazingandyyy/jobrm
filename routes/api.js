"use strict";

const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");

const jwtCheck = jwt({
    secret: new Buffer('7kZNdYeUS_MeSCrqsjSTMWY6ZCyGY3Yo49esbtjTj-5hOvLX2MUw6AVVbcb_gOnP', 'base64'),
    audience: 'USRhQhbNBhwGgJguSUHubkKjcAXY0zcX'
});


router.use("/twilio", require("./twilio"));
router.use("/users", require("./users"));
router.use("/sendmail", require("./sendmail"));
router.use("/applications", require("./applications"));
//Do we want jwtCheck on some of the other routes as well? I say yes.
router.use("/gmailAPI", require("./gmailAPI"), jwtCheck);

module.exports = router;
