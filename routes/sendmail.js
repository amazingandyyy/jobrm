'use strict';
const router = require('express').Router();
const nodemailer = require('nodemailer');


router.post('/', (req, res) => {
    let userEmail = req.body.email;
    let subject = req.body.subject
    let message = req.body.message
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        }
        });

    let mailOptions = {
        from: `"JRM" ${process.env.EMAIL_ACCOUNT}`, // sender address
        to: userEmail, // list of receivers
        subject: subject, // Subject line
        text: message, // plaintext body
        html: message// html body
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
    res.send();
})

module.exports = router;
