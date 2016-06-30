'use strict';
const router = require('express').Router();
const SendGrid = require('../lib/sendgrid');

router.post('/', (req, res) => {
    let userEmail = req.body.email;
    let subject = req.body.subject
    let message = req.body.message

    let jobAppArr = {};

    jobAppArr  = {
        userEmail : req.body.email,
        subject : req.body.subject,
        message : req.body.message
    };

    SendGrid.sendGridNotification(jobAppArr, (err, returnValue) => {
        res.status(err ? 400 : 200).send(err || returnValue);
    });
})

module.exports = router;
