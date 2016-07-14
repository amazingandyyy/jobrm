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
        id: {
            type: String
        },
        etag: {
            type: String
        },
        //summary is Google-designated name for title
        summary: {
            type: String
        },
        events: [{
            parentNarrativeId: {
                type: String
            },
            milestoneId: {
                type: String
            },
            id: {
                type: String
            },
            summary: {
                type: String
            },
            startDate: {
                type: String
            },
            htmlLink: {
                type: String
            },
            description: {
                type: String
            }
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
            subject: 'Thanks for joining JSM.',
            message: `<!DOCTYPE html>
                    <html>
                    <header>
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.2/css/bootstrap.min.css">
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css">
                        <link href='https://fonts.googleapis.com/css?family=Lato:100,400,300,700,900' rel='stylesheet' type='text/css' />
                    </header>

                    <body>
                        <div style="padding-top: 50px; text-align: center; font-family: Lato; ">
                            <img style="max-width: 60px" src="https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/13726603_140918963002565_772279474490688508_n.jpg?oh=1ee5e15415328fb2b8aea160d6c376eb&oe=57EDA241"/>
                            <div style="padding: 100px 10px 0px 10px;">
                                <h1 style="font-size: 4em; font-weight: 100;">Welcome!</h1>
                                <h3>Thanks for being one of our beta users.</h3>
                                <br>
                                <br>
                                <h2 style="font-size: 1.2em;">After you login, just click the red button on the top right side to start!</h2>
                                <br>
                                <img style="max-width: 90%" src="https://scontent-sjc2-1.xx.fbcdn.net/t31.0-8/13669528_140916153002846_827278125048679139_o.jpg"/>
                            </div>
                            <div style="background: #fafafa; padding: 80px 10px;">
                                <div class="container">
                                    <h1><i style="transform: rotate(270deg)" class="fa fa-space-shuttle"></i></h1>
                                    <h1 style="font-weight: 300; color: #333">Power up your job applying.</h1>
                                    <h5 style="line-height: 1.4em; font-weight: 300">Record and managment everything you need and help you find a brilliant job.
                                <br>
                                    You can save every detials that you have in the process of your job application.
                                <br>
                                    For example, the information of hiring agency, the reference person's contact, interview's time and more.
                                <br>
                                    JSM system will automatically generate a calendar and todolist for you. Everything are synced to your personal google account.</h5>
                                    <br>

                                    <button class="btn-default btn btn-lg" style="background: #FF5252; color: white;">Start it Now.</button>
                                </div>
                            </div>
                            <div class="row" style="background: white; padding: 100px 10px;">
                                <div class="col-sm-12">
                                    <h1 style="font-weight: 300; color: #333">Team</h1>
                                    <h3 style="line-height: 1.4em; font-weight: 300">We are passionate and confident full-stack developers. <br>
                                        Built this project for 21 days.</h3>
                                    <br>
                                    <div class="col-sm-3 authorContainer">
                                        <img style="margin-bottom: 20px; width: 120px;" class="img-rounded authorImage" src="https://avatars1.githubusercontent.com/u/7886068?v=3&amp;s=460">
                                        <h3 style="font-size: 1.3em;">Andy Chen</h3>
                                        <span class="work ng-binding">Frontend, Angular</span>
                                        <br>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://github.com/amazingandyyy" class="ng-scope"><i class="fa fa-github"></i></a>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://www.linkedin.com/in/amazingandyyy" class="ng-scope"><i class="fa fa-linkedin-square"></i></a>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://www.facebook.com/amazingandyyy" class="ng-scope"><i class="fa fa-facebook-square"></i></a>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="http://amazingandyyy.github.io/" class="ng-scope"><i class="fa fa-globe"></i></a>
                                    </div>
                                    <div class="col-sm-3 authorContainer">
                                        <img style="margin-bottom: 20px; width: 120px;" class="img-rounded authorImage" src="https://avatars0.githubusercontent.com/u/7968378?v=3&amp;s=460">
                                        <h3 style="font-size: 1.3em;">Dave Lee</h3>
                                        <span class="work ng-binding">D3, Email&amp;SMS API</span>
                                        <br>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://github.com/march-dave" class="ng-scope"><i class="fa fa-github"></i></a>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://www.linkedin.com/in/dave-lee-a171845" class="ng-scope"><i class="fa fa-linkedin-square"></i></a>
                                    </div>
                                    <div class="col-sm-3 authorContainer">
                                        <img style="margin-bottom: 20px; width: 120px;" class="img-rounded authorImage" src="https://avatars2.githubusercontent.com/u/16375138?v=3&amp;s=460">
                                        <h3 style="font-size: 1.3em;">David Urbina</h3>
                                        <span class="work ng-binding">Google API, Auth0</span>
                                        <br>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://github.com/WindUpDurb" class="ng-scope"><i class="fa fa-github"></i></a>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://www.linkedin.com/in/david-urbina-589327b9" class="ng-scope"><i class="fa fa-linkedin-square"></i></a>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="http://www.windupdurb.com/" class="ng-scope"><i class="fa fa-globe"></i></a>
                                    </div>
                                    <div class="col-sm-3 authorContainer">
                                        <img style="margin-bottom: 20px; width: 120px;" class="img-rounded authorImage" src="https://avatars2.githubusercontent.com/u/11866441?v=3&amp;s=460">
                                        <h3 style="font-size: 1.3em;">Tsinat Zeree</h3>
                                        <span class="work ng-binding">Backend, MongoDB</span>
                                        <br>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://github.com/tsinat" class="ng-scope"><i class="fa fa-github"></i></a>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="https://www.linkedin.com/in/tsinat" class="ng-scope"><i class="fa fa-linkedin-square"></i></a>
                                        <a style="color: #797979; font-size: 1.4em; letter-space: 2px;" target="_blank" href="http://tsinatzeree.com/" class="ng-scope"><i class="fa fa-globe"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="login-hero" style="background-color: #ff3a33; background-image: url('http://www.transparenttextures.com/patterns/black-thread.png'); padding: 100px; color: white; position: relative;">
                                    <img style="max-width: 60px" src="https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-9/13726603_140918963002565_772279474490688508_n.jpg?oh=1ee5e15415328fb2b8aea160d6c376eb&oe=57EDA241"/>
                                    <p style="font-weight: 300"></p>
                                    <h3 class="hidden-xs-down">It's in beta, why not try it and tell us what you think.</h3>
                                    <h3 class="hidden-sm-up">Try beta for free.</h3>
                                    <br>
                                    <button class="btn-default btn btn-lg" style="background: white; color: #FF5A54;">Log in now.</button>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>`
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
    User.find({}, (err, users) => {
        cb(err, users);
    });
};

userSchema.methods.generateToken = function() {
    var payload = {
        _id: this._id,
        exp: moment().add(1, 'day').unix()
    };
    return jwt.sign(payload, JWT_SECRET);
};

const SendGrid = require('../lib/sendgrid');
userSchema.methods.sendEmail = function(obj) {

    let jobAppObj;
    jobAppObj = {
        userEmail: obj.email,
        subject: obj.subject,
        message: obj.message
    };

    SendGrid.sendGridNotification(jobAppObj, (err, returnValue) => {
        if (err) {
            console.log('err when sendgrid send out email: ', err);
        }
        console.log('returnValue: ', returnValue);
    });
};

let User = mongoose.model("User", userSchema);

module.exports = User;
