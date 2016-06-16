var router = require('express').Router();
var nodemailer = require('nodemailer');

var secret = process.env.GMAIL_PASSWORD;
var email = process.env.EMAIL_ACCOUNT;

router.post('/', (req, res) => {
    var userEmail = req.body.email;
    var subject = req.body.subject
    var message = req.body.message
    var transporter = nodemailer.createTransport(`smtps://${email}:${secret}@smtp.gmail.com`);

    var mailOptions = {
        from: `"JRM" ${email}`, // sender address
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
