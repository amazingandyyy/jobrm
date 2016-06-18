"use strict";
//amazing andy2!!
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');


const JWT_SECRET = process.env.JWT_SECRET;

let userSchema = new mongoose.Schema({
    email: {
        type: String
    },
    name: {
        type: String
    },
    given_name: {
        type: String
    },
    family_name: {
        type: String
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }]

});


userSchema.statics.saveGmailUser = (user, cb) => {
    User.findOne({'email': user.email }, (err, dbUser) => {
        if(err) {
            return cb(err);
        } else if(dbUser){
            return cb(null, dbUser);
        }

        let newUser = new User({
            email: user.email,
            name:  user.name,
            given_name: user.given_name,
            family_name: user.family_name
        });

        let sendmail = {
            email: user.email,
            subject: 'JRM signup',
            message: 'Thank you for signing up for JRM. you can now start using our App.'

        };
        let mail = newUser.sendEmail(sendmail);

        newUser.save((err, savedUser) => {
            if(err) return cb(err);
            cb(null, savedUser);
        });
    });
};

userSchema.statics.addApplication = (userId, applicationId, cb) => {
    console.log('working');
    User.findById(userId, (err, dbUser) => {
        if(dbUser.applications.indexOf(applicationId) < 0){
            dbUser.applications.push(applicationId);
        }

        dbUser.save((err, savedUser) => {
            if(err) cb(err);

            cb(null, savedUser);
        });
    });
};

userSchema.statics.edit = (id, passedObj, cb) => {
    User.findByIdAndUpdate(id, {
        $set: passedObj
    }, (err, updatedUser) => {
        if (err) cb(err);

        updatedUser.save((err, savedUser) => {
            if (err) cb(err);
            cb(null, savedUser);
        });
    });
};


userSchema.methods.sendEmail = function(obj) {
    let userEmail = obj.email;
    let subject = obj.subject
    let message = obj.message
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.GMAIL_PASSWORD
        }
        });

    let mailOptions = {
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
}

let User = mongoose.model("User", userSchema);

module.exports = User;
