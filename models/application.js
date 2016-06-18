
'use strict';

const mongoose = require('mongoose');
const User = require('../models/user');

let applicationSchema = new mongoose.Schema({
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
    lastUpdate: {
        type: Date
    },
    applicationDate: {
        type: String
    },
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
    feedbackNote: {
        type: String
    },
    applicationNote: {
        type: String
    },
    whatToImprove: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    hiringAgency: {
        name: String,
        phone: String,
        email: String
    },
    referencePerson: {
        name: String,
        phone: String,
        email: String
    },
    companyContact: {
        name: String,
        phone: String,
        email: String
    },
    interviewerContact: {
        name: String,
        phone: String,
        email: String
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    milestone: []

});

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

applicationSchema.statics.createApps = (applicationArr, cb) => {
    applicationArr.forEach(applicationObj=>{
        Application.create(applicationObj, (err, application) => {
            console.log('applicationsssss: ', application);
            if (err)  return cb(err);
            cb(null, application);
        });
    });
};

applicationSchema.statics.createApp = (applicationObj, cb) => {
    console.log('applicationObj: ', applicationObj);
    Application.create(applicationObj, (err, application) => {
        console.log('applicationsssss: ', application);
        if (err)  return cb(err);
        cb(null, application);
    });
    // let application = new Application(applicationObj);
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


let Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
