'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');
const moment = require('moment');

let applicationSchema = new mongoose.Schema({
    company: {
        type: String
    },
    position: {
        type: String
    },
    jobLocation: {
        type: String
    },
    applicationDate: {
        type: String
    },
    info: {
        resource: String,
        resourceUrl: String
    },
    friend: {
        email: String,
        name: String,
        phone: String,
        notes: String
    },
    hiringAgency: {
        address: String,
        email: String,
        name: String,
        phone: String,
        notes: String
    },
    recruiter: {
        email: String,
        name: String,
        notes: String,
        phone: String
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    dueTime: {
        type: String
    },
    noficationSent: {
        type: Boolean,
        default: false
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    milestones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Milestone'
    }]
});

applicationSchema.statics.getFeedbackDateList = cb => {
    let today = moment().startOf('day');
    // let feedbackDate = moment(today).add(7, 'days');

    Application.find({
            // completed: 'false',
            noficationSent: 'false',
            dueTime: {
                $eq: today.toDate()
            }
        },
        (err, applications) => {
            cb(err, applications);
            // noficationSent;
        }).populate('applicant');
};

applicationSchema.statics.getAll = (id, cb) => {
    Application.find({
            applicant: id
        })
        .exec((err, applications) => {
            cb(err, applications);
        });
};

applicationSchema.statics.getOne = (applicationId, cb) => {
    Application.findById(applicationId, (err, application) => {

        cb(err, application);
    }).populate('milestones');
};

applicationSchema.statics.createApp = (applicationObj, applicantId, cb) => {
    console.log('applicationObj: ', applicationObj);
    let newApplication = {
        company: applicationObj.company,
        position: applicationObj.position,
        jobLocation: applicationObj.jobLocation,
        applicationDate: applicationObj.applicationDate,
        info: applicationObj.info,
        friend: applicationObj.friend,
        hiringAgency: applicationObj.hiringAgency,
        recruiter: applicationObj.recruiter,
        dueTime: applicationObj.dueTime,
        applicant: applicantId
    }
    Application.create(newApplication, (err1, application) => {
        cb(err1, application);
    });
};

applicationSchema.statics.updateApp = (applicationId, applicationObj, cb) => {
    Application.findByIdAndUpdate(applicationId, {
        $set: applicationObj
    }, {
        new: true
    }, (err, updatedApplication) => {
        if (err) cb(err);
        cb(null, updatedApplication);

    });
};

applicationSchema.statics.deleteApp = (userId, applicationId, cb) => {
    Application.findByIdAndRemove(applicationId, (err1, deletedApplication) => {
        User.findById(userId, (err2, dbUser) => {
            if (err1 || err2) return cb(err1 || err2);

            dbUser.applications = dbUser.applications.filter(function(app) {
                return app.toString() !== applicationId;
            });

            dbUser.save((err, savedUser) => {
                if (err) cb(err);
                cb(null, savedUser);
            });
        });
    });
};

let Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
