'use strict';

var mongoose = require('mongoose');
var User = require('../models/user');

var applicationSchema = new mongoose.Schema({
    company: {
        type: String,
        required: false
    },
    jobTitle: {
        type: String,
        required: false
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    applicationDate: {
        type: String
    },
    hiringAgency: {
        name: {
            type: String
        },
        phone: {
            type: Number
        },
        email: {
            type: String
        }
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
    referencePerson: {
        name: {
            type: String
        },
        email: {
            type: String
        },
        number: {
            type: Number
        }
    },
    companyContact: {
        name: {
            type: String
        },
        email: {
            type: String
        },
        number: {
            type: Number
        }
    },
    applicationNote: {
        type: String
    },
    interviewerContact: {
        name: {
            type: String
        },
        email: {
            type: String
        },
        number: {
            type: Number
        }
    },
    feedbackNote: {
        type: String
    },
    whatToImprove: {
        type: String
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
    });
};

applicationSchema.statics.getOne = (applicationId, cb) => {
    Application.findById(applicationId, (err, application) => {
        if (err) cb(err);

        cb(null, application);
    });
};

applicationSchema.statics.createApp = (applicationObj, cb) => {
    var application = new Application(applicationObj);
    application.save((err, savedApplication) => {
        if (err) cb(err);

        cb(null, savedApplication);
    });
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

applicationSchema.deleteApp = (userId, applicationId, cb) => {
    Application.findByIdAndRemove(applicationId, (err1, deletedApplication) => {
        User.findById(userId, (err2, dbUser) => {
            if (err1 || err2) cb(err1 || err2);

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
