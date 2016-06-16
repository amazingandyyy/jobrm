'use strict';

var mongoose = require('mongoose');
var User = require('../models/user');

var applicationSchema = new mongoose.Schema({
    company: {
        type: String
    },
    jobTitle: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    applicationDate: {
        type: String
    },
    hiringAgency: [],
    jobLocation: {
        type: String
    },
    applicationSite: {
        type: String
    },
    applicationLink: {
        type: String
    },
    feedbackDate: {
        type: Date
    },
    jobLocation: {
        type: String,
        required: false
    },
    applicationSite: {
        type: String,
        required: false
    },
    applicationLink: {
        type: String,
        required: false
    },
    feedbackDate: {
        type: Date,
        required: false
    },
    referencePerson: [],
    companyContact: [],
    applicationNote: {
        type: String
    },
    interviewerContact: [],
    feedbackNote: {
        type: String
    },
    whatToImprove: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    applicant: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

applicationSchema.statics.getAll = cb => {
    Application.find({}, (err, applications) => {
        if (err) cb(err);

        cb(null, applications);
    }).populate('applicant');
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
        if (err) cb(err);
        cb(null, application);
    });
    // var application = new Application(applicationObj);
    // console.log('applicationsssss: ', application);
    // application.save((err, savedApplication) => {
    //     console.log('savedApplication: ', savedApplication);
    //     if (err) cb(err);
    //
    //     cb(null, savedApplication);
    // });
};

applicationSchema.statics.updateApp = (userId, applicationObj, cb) => {
    Application.findByIdAndUpdate(userId, {
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


var Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
