"use strict";

const express = require("express");
const router = express.Router();

const Application = require('../models/application');
const Milestone = require('../models/milestone');
const User = require('../models/user');

router.post('/', User.isLoggedIn, (req, res) => {
    let applicationId = req.body.applicationId;
    let milestoneObj = req.body.milestoneData;
    Milestone.createMilestone(milestoneObj, applicationId, (err, savedApplication) => {
        console.log('savedApplication', savedApplication);
        res.status(err ? 400: 200).send(err || savedApplication);
    });
});

router.get('/:id', User.isLoggedIn,  (req, res) => {
    Milestone.getOne(req.params.id, (err, milestone) => {
        res.status(err ? 400: 200).send(err || milestone);
    });
});
router.get('/', User.isLoggedIn,  (req, res) => {
    Milestone.find({}, (err, milestones) => {
        res.status(err ? 400: 200).send(err || milestones);
    });
});

router.put('/:id', User.isLoggedIn,  (req, res) => {
    Milestone.updateMilestone(req.params.id, req.body, (err, updatedMilestone) => {
        res.status(err ? 400: 200).send(err || updatedMilestone);
    });
});

router.delete('/:applicationId/delete/:milestoneId', User.isLoggedIn, (req, res) => {
    let milestoneId = req.params.milestoneId;
    let applicationId = req.params.applicationId;
    Milestone.deleteMilestone(milestoneId, applicationId, (err, updatedApplication) => {
        res.status(err ? 400: 200).send(err || updatedApplication);
    });
});

//add task to milestone
router.post('/:milestoneId', User.isLoggedIn, (req, res) => {
    Milestone.addTask(req.params.milestoneId, req.body, (err, updatedMilestone) => {
        res.status(err ? 400: 200).send(err || updatedMilestone);
    });
});

//edit task from a given milestone
router.put('/:milestoneId/update/:taskId', User.isLoggedIn, (req, res) => {
    Milestone.updateTask(req.params.milestoneId, req.params.taskId, req.body, (err, updatedMilestone) => {
        res.status(err ? 400: 200).send(err || updatedMilestone);
    });
});

//remove task from a milestone
router.delete('/:milestoneId/remove/:taskId', User.isLoggedIn, (req, res) => {
    Milestone.removeTask(req.params.milestoneId, req.params.taskId, (err, updatedMilestone) => {
        res.status(err ? 400: 200).send(err || updatedMilestone)
    })
})

module.exports = router;
