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
        type: Date
    },
    feedbackDate: {
        type: Date
    },
    data:{

    },
    dueTime: {
        type: String
    },
<<<<<<< HEAD
=======
    applicant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    milestones: [],
>>>>>>> andy
    completed: {
        type: Boolean,
        default: false
    },
    lastUpdate: {
        type: Date
    },
    applicant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    milestones: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Milestone'
    }]
});

applicationSchema.statics.getLastSevenDaysAll = cb => {

    let today = moment().startOf('day');
    let feedbackDate = moment(today).add(7, 'days');

    Application.find({
        'completed': 'false',
        feedbackDate: {
        '$eq': today.toDate()
        }},
        (err, applications) => {
            if (err) cb(err);

            cb(null, applications);
    }).populate('applicant');
};

applicationSchema.statics.getAll = (id, cb) => {
    Application.find({applicant: id})
        .exec((err, applications) => {
        if (err) cb(err);
        cb(null, applications);
    });
};

applicationSchema.statics.getOne = (applicationId, cb) => {
    Application.findById(applicationId, (err, application) => {
        if (err) cb(err);

        cb(null, application);
    }).populate('applicant');
};

applicationSchema.statics.createApp = (applicationObj, cb) => {
    console.log('applicationObj: ', applicationObj);
    Application.create(applicationObj, (err, application) => {
        console.log('applicationsssss: ', application);
        Application.findById(application._id, (err, dbApplication) => {
            dbApplication.applicant.push(applicationObj.applicant);

            dbApplication.save((err, savedApplication) => {
                if (err)  return cb(err);
                cb(null, application);
            })
        })
    });
};

applicationSchema.statics.updateApp = (applicationId, applicationObj, cb) => {
    Application.findByIdAndUpdate(applicationId, {
        $set: applicationObj
    }, {
        new: true
    }, (err, updatedApplication) => {
        if (err) cb(err);

        updatedApplication.save((err, savedApplication) => {
            if (err) cb(err);
            cb(null, savedApplication);
        });
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
