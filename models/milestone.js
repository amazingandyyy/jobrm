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
    task: [{

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

        updatedMilestone.save((err, savedMilestone) => {
            if(err) return cb(err);
            cb(null, savedMilestone);
        });
    });
};

let Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;
