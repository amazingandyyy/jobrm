'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');
const moment = require('moment');

let applicationSchema = new mongoose.Schema({
    createAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: String
    },
    generalNarrativeData:{

    },
    dueTime: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    notified: {
        type: Boolean, default: false
    },
    noficationSent: {
        type: Boolean,
        default: false
    },
    applicant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    milestones: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Milestone'
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
        }},
        (err, applications) => {
            cb(err, applications);
            // noficationSent;
    }).populate('applicant');
};

applicationSchema.statics.getAll = (id, cb) => {
    Application.find({applicant: id})
        .exec((err, applications) => {
        cb(err, applications);
    });
};

applicationSchema.statics.getOne = (applicationId, cb) => {
    Application.findById(applicationId, (err, application) => {

        cb(err, application);
    }).populate('milestones');
};

applicationSchema.statics.createApp = (applicationObj, cb) => {
    console.log('applicationObj: ', applicationObj);
    let newApplication = {
        dueTime: applicationObj.dueTime,
        generalNarrativeData: applicationObj
    }
    Application.create(newApplication, (err1, application) => {
        if(err1) {
            console.log('error while creating application: ', err1);
            return cb(err1);
        }
        Application.findById(application._id, (err2, dbApplication) => {
            if(err2) {
                console.log('error while creating application: ', err2);
                return cb(err2);
            }
            dbApplication.applicant.push(applicationObj.applicant);

            dbApplication.save((err, savedApplication) => {
                cb(err, application);
            })
        })
    });
};

applicationSchema.statics.updateApp = (applicationId, applicationObj, cb) => {
    let newApplication = {
        dueTime: applicationObj.dueTime,
        generalNarrativeData: applicationObj
    }
    Application.findByIdAndUpdate(applicationId, {
        $set: newApplication
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
