'use strict';

const mongoose = require('mongoose');
const Application = require('../models/application');
const moment = require('moment');

let milestoneSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date
    },
    newMilestone: {

    },
    tasks: [{

    }],
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }
});

milestoneSchema.statics.getOne = (milestoneId, cb) => {
    Milestone.findById(milestoneId, (err, milestone) => {
        if(err || !milestone) return cb(err);
        cb(null, milestone);
    }).populate('application');
};

milestoneSchema.statics.createMilestone = (milestoneObj, applicationId, googleAccess,  cb) => {
    console.log('milestoneObj:', applicationId);
    let newMilestone = {
        description:milestoneObj.description,
        createAt: milestoneObj.time,
        title: milestoneObj.title,
        application: applicationId,
        newMilestone: milestoneObj
    };
    console.log("New milestone: ", newMilestone);
    console.log("Google Access: ", googleAccess);
    Milestone.create(newMilestone, (err, milestone) => {
        if(err || !milestone) return cb(err);
        Application.findById(applicationId, (err, dbApplication) => {
            if(!dbApplication) return cb(err);
            console.log('dbApplication:', dbApplication);
            dbApplication.milestones.push(milestone._id);
            dbApplication.save((err, savedApplication) => {
                if (err)  return cb(err);
                Application.findById(savedApplication._id, (err2, dbSavedApplication) => {
                    cb(err2, dbSavedApplication);
                }).populate('milestones');

            });
        });
    });
};

milestoneSchema.statics.updateMilestone = (milestoneId, updateObj, cb) => {
    console.log('update:', updateObj);
    Milestone.findById(milestoneId, (err, milestone) =>{
        if(err || !milestone) return cb(err);
            milestone.description =updateObj.description,
            milestone.newMilestone = updateObj

        milestone.save((err, savedMilestone) => {
            cb(err, savedMilestone);
        });
    });
};

milestoneSchema.statics.deleteMilestone = (milestoneId, applicationId, cb) => {
    Milestone.findByIdAndRemove(milestoneId, (err, deletedMilestone) => {
        if(err || !deletedMilestone) return cb(err);

        Application.findById(applicationId, (err2, application) => {
            if(err2 || !application) return cb(err2);
            application.milestones = application.milestones.filter(milestone => {
                return milestone.toString() !== milestoneId
            });

            application.save((err, savedApplication) => {
                cb(err, savedApplication);
            });
        });
    });
};

milestoneSchema.statics.addTask = (milestoneId, newTaskObj, cb) => {
    Milestone.findById(milestoneId, (err, milestone) => {
        if(err || !milestone) return cb(err);
        milestone.tasks.push(newTaskObj);

        milestone.save((err, savedMilestone) => {
            if(err) return cb(err);
            cb(null, savedMilestone);
        });
    });
};

let Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;
