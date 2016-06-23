"use strict";

const express = require("express");
const router = express.Router();
const jwt = require("express-jwt");

// const CronJob = require("../lib/cronjob");
// CronJob.dailyBaseCronJobNotification();
//
// const SendGrid = require('../lib/sendgrid');
// SendGrid.sendGridNotification();

const jwtCheck = jwt({
    secret: new Buffer('7kZNdYeUS_MeSCrqsjSTMWY6ZCyGY3Yo49esbtjTj-5hOvLX2MUw6AVVbcb_gOnP', 'base64'),
    audience: 'USRhQhbNBhwGgJguSUHubkKjcAXY0zcX'
});

router.use("/ds3", require("./ds3"));
router.use("/glassdoor", require("./glassdoor"));
router.use("/twilio", require("./twilio"));
router.use("/users", require("./users"));
router.use("/sendmail", require("./sendmail"));

router.use("/applications", require("./applications"), jwtCheck);
//Do we want jwtCheck on some of the other routes as well? I say yes.

router.use("/gmailAPI", require("./gmailAPI"), jwtCheck);
router.use("/googleCalendar", require("./googleCalendarAPI"), jwtCheck);

module.exports = router;
