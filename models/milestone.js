'use strict';

const mongoose = require('mongoose');
const Application = require('../models/application');
const moment = require('moment');

const GoogleCalendarOperations = require("./googleCalendarModels");

let milestoneSchema = new mongoose.Schema({
    googleCalendarId: { type: String },
    description: {
        type: String,
        trim: true
    },
    state: {
        title: String,
        color: String,
        className: String
    },
    title: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    emailrelated: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    taskList: [{
        title: String,
        done: { type: Boolean},
        createAt: { type: Date, default: Date.now }
    }],
    // tasks: [{
    //     title: String,
    //     // summary: String,
    //     // completed: { type: Boolen, default: False},
    //     createAt: { type: Date, default: Date.now },
    //     finishBy: String
    // }],
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
    console.log('milestoneObj:', applicationId);
    let newMilestone = {
        description:milestoneObj.description,
        stoneWhere: milestoneObj.stoneWhere,
        state: milestoneObj.state,
        title: milestoneObj.title,
        date: milestoneObj.date,
        time: milestoneObj.time,
        taskList: milestoneObj.taskList,
        application: applicationId,
        emailrelated: milestoneObj.emailrelated
    };
    Milestone.create(newMilestone, (err, milestone) => {
        if(err || !milestone) return cb(err);
        Application.findById(applicationId, (err, dbApplication) => {
            if(!dbApplication) return cb(err);
            dbApplication.milestones.push(milestone._id);
            dbApplication.save((err, savedApplication) => {
                console.log('savedApplication:', savedApplication);
                if (err)  return cb(err);
                Application.findById(savedApplication._id, (err2, dbSavedApplication) => {
                    console.log('findById:', dbSavedApplication);
                    let toReturn = {
                        dbSavedApplication: dbSavedApplication,
                        newMilestone: milestone
                    };
                    cb(err2, toReturn);
                }).populate('milestones');
            });
        });
    });
};

milestoneSchema.statics.updateMilestone = (milestoneId, updateObj, cb) => {
    console.log('update:', updateObj);
    Milestone.findByIdAndUpdate(milestoneId, {$set: updateObj }, {new: true}, (err, milestone) =>{
        cb(err, milestone);
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

milestoneSchema.statics.updateTask = (milestoneId, taskId, newTaskObj, cb) => {
    Milestone.findById(milestoneId, (err, milestone) => {
        if(err || !milestone) return cb(err);

        for(var i=0, x = milestone.tasks.length; i < x; i++){
            if(milestone.tasks[i]._id == taskId){
                console.log('test:', taskId)
                milestone.tasks[i].title = newTaskObj.title;
                milestone.tasks[i].summary = newTaskObj.summary;
                milestone.tasks[i].finishBy = newTaskObj.finishBy;
            }
        }
        milestone.save((err, updatedMilestone) => {
            cb(err, updatedMilestone);
        });
    });
};

milestoneSchema.statics.removeTask = (milestoneId, taskId, cb) => {
    Milestone.findById(milestoneId, (err, milestone) => {
        if(err || !milestone) return cb(err);

        milestone.tasks = milestone.tasks.filter(function(obj) {
            return obj._id != taskId;
        });
        milestone.save((err, updatedMilestone) =>{
            cb(err, updatedMilestone);
        });
    });
};

let Milestone = mongoose.model('Milestone', milestoneSchema);

module.exports = Milestone;
