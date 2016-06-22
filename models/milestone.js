'use strict';

const mongoose = require('mongoose');
const Application = require('../models/application');
const moment = require('moment');

let milestoneSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true
    },
    notes : {
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

milestoneSchema.statics.createMilestone = (milestoneObj, applicationId,  cb) => {
    let newMilestone = milestoneObj;
        newMilestone.application = applicationId;
    Milestone.create(newMilestone, (err, milestone) => {
        if(err || !milestone) return cb(err);
        Application.findById(applicationId, (err, dbApplication) => {
            if(!dbApplication) return cb(err);
            dbApplication.milestones.push(milestone._id);

            dbApplication.save((err, savedApplication) => {
                if (err)  return cb(err);
                cb(null, savedApplication);
            });
        });
    });
};

milestoneSchema.statics.updateMilestone = (milestoneId, updateObj, cb) => {
    Milestone.findByIdAndUpdate(milestoneId, updateObj, {new: true}, (err, updatedMilestone) =>{
        if(err || !updatedMilestone) return cb(err);

        cb(null, updatedMilestone);
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
                if(err) return cb(err);
                cb(null, savedApplication);
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
