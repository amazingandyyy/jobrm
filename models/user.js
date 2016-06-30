"use strict";
//amazing andy2!!
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const moment = require('moment');

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
    phone: {
        type: String,
        default: ''
    },
    picture: {
        type: String
    },
    gmail: {

    },
    googleCalendarData: {
        id: {type: String},
        etag: {type: String},
        //summary is Google-designated name for title
        summary: {type: String},
        events: [{
            parentNarrativeId: { type: String },
            milestoneId: { type: String },
            id: { type: String },
            summary: { type: String },
            startDate: { type: String },
            htmlLink: { type: String },
            description: { type: String }
        }]
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }]

});

userSchema.statics.isLoggedIn = (req, res, next) => {
    var token = req.cookies.accessToken;

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).send({
            error: 'Authentication required'
        });

        User.findById(payload._id, (err, user) => {
            if (err || !user) return res.status(401).send({
                error: 'User not found'
            });
            req.user = user;

            next();
        });
    });

};

userSchema.statics.saveGmailUser = (user, cb) => {
    console.log('User:', user);
    User.findOne({
        'email': user.email
    }, (err, dbUser) => {
        if (err) {
            return cb(err);
        } else if (dbUser) {

            var token = dbUser.generateToken();
            return cb(null, token, dbUser);
        }
        user.identities.access_token = '';
        let newUser = new User({
            email: user.email,
            name: user.name,
            given_name: user.given_name,
            picture: user.picture,
            family_name: user.family_name,
            gmail: user,
            clientId: user.clientId
        });

        let sendmail = {
            email: user.email,
            subject: 'JRM signup',
            message: 'Thank you for signing up for JRM. you can now start using our App.'
        };

        let mail = newUser.sendEmail(sendmail);

        var token = newUser.generateToken();

        newUser.save((err, savedUser) => {
            cb(err, token, savedUser);
        });
    }).populate('applications');
};

userSchema.statics.addApplication = (applicantId, applicationId, cb) => {
    User.findById(applicantId, (err, dbUser) => {
        console.log('dbUser: ', dbUser);
        if (dbUser.applications.indexOf(applicationId) !== -1) {
            cb(null, dbUser)
        }
        dbUser.applications.push(applicationId);
        dbUser.save((err, savedUser) => {
            if (err) cb(err);
            cb(null, savedUser);
        });
    });
};

userSchema.statics.edit = (id, updatedUserObj, cb) => {
    User.findByIdAndUpdate(id, {
        $set: updatedUserObj
    }, (err, updatedUser) => {
        cb(err, updatedUser);
    });
};

userSchema.statics.getUsers = (cb) => {
    User.find( {}, (err, users) => {
        cb(err, users);
    });
};

userSchema.methods.generateToken = function() {
    var payload = {
        _id: this._id,
        exp: moment().add(1, 'day').unix()
    };
    console.log('JWT_SECRET:', JWT_SECRET);
    return jwt.sign(payload, JWT_SECRET);
};

const SendGrid = require('../lib/sendgrid');
userSchema.methods.sendEmail = function(obj) {

    let jobAppArr = {};
    jobAppArr  = {
        userEmail : obj.email,
        subject : obj.subject,
        message : obj.message
    };

    SendGrid.sendGridNotification(jobAppArr, (err, returnValue) => {
        if (err) { console.log(err); }
    });
};

let User = mongoose.model("User", userSchema);

module.exports = User;
