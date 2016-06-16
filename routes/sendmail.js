var router = require('express').Router();
var nodemailer = require('nodemailer');


router.post('/', (req, res) => {
    var userEmail = req.body.email;
    var subject = req.body.subject
    var message = req.body.message
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        }
        });

    var mailOptions = {
        from: `"JRM" ${process.env.GMAIL_PASSWORD}`, // sender address
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
