"use strict";

const express = require("express");
const router = express.Router();

const GoogleCalendarOperations = require("../models/googleCalendarModels");
const Application = require('../models/application');
const User = require('../models/user');
const Milestone = require('../models/milestone');

router.get('/all/:applicantId', User.isLoggedIn, (req, res) => {
    console.log('applicantId:', req.params.applicantId);
    Application.getAll(req.params.applicantId, (err, allApplications) => {
        res.status(err ? 400 : 200).send(err || allApplications);
    });
});
router.delete('/all', User.isLoggedIn, (req, res) => {
    Application.remove({}, (err, allApplications) => {
        res.status(err ? 400 : 200).send(err || allApplications);
    });
});

router.get('/:id', User.isLoggedIn,  (req, res) => {
    Application.getOne(req.params.id, (err, application) => {
        res.status(err ? 400 : 200).send(err || application);
    });
});

router.post('/create', User.isLoggedIn, (req, res) => {
    console.log('new application: ', req.body);
    let newApplication = req.body.applicationData;
    let applicantId = req.body.applicantId;
    Application.createApp(newApplication, applicantId, (err, application) => {
        console.log('application: ', application);
        if (err) {
            res.status(400).send(err);
        } else {
            User.addApplication(applicantId, application._id, (error, updateUser) => {
                if (error){
                    console.log('error while returning updated user: ', error);
                    res.status(400).send(error)
                }

                let newMilestone = {
                    description: `Follow-up with ${application.company} regarding the ${application.position} position if I have not received a response from them.`,
                    stoneWhere: application.company,
                    //state: milestoneObj.state,
                    title: `Follow-up with ${application.company} Regarding ${application.position}`,
                    time: "12:00T",
                    date: application.expectedInitialResponse,
                    application: application._id
                };

                console.log("New Milestone: ", newMilestone)
                Milestone.createMilestone(newMilestone, application._id, (error, savedMilestone) => {
                    let responseData = {
                        newApplication: application,
                        updatedApplicant: updateUser,
                        savedMilestone: savedMilestone
                    };
                    console.log("Response Data: ", responseData)
                    res.send(responseData);
                });
            });
        }
    });
});

router.put('/:id', User.isLoggedIn, (req, res) => {
    Application.updateApp(req.params.id, req.body, (err, updatedApplication) => {
        res.status(err ? 400 : 200).send(err || updatedApplication);
    });
});

router.post('/:userId/delete/:appId', User.isLoggedIn, (req, res) => {
    Application.deleteApp(req.params.userId, req.params.appId, (err, deletedApplication) => {
        if (err) res.status(400).send(err);
        GoogleCalendarOperations.deleteEventsFromNarrative(req.params.userId, req.params.appId, req.body, (error, results) => {
           
            
            res.send();
        });
    });
});

module.exports = router;
