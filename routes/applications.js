"use strict";

const express = require("express");
const router = express.Router();
const Application = require('../models/application');
const User = require('../models/user');

router.get('/all/:userId', (req, res) => {
    console.log('iddddd:', req.params.userId);
    Application.getAll(req.params.userId, (err, allApplications) => {
        res.status(err ? 400 : 200).send(err || allApplications);
    });
});
router.delete('/all', (req, res) => {
    Application.remove({}, (err, allApplications) => {
        res.status(err ? 400 : 200).send(err || allApplications);
    });
});

router.get('/:id', (req, res) => {
    Application.findById(req.params.id, (err, application) => {
        res.status(err ? 400 : 200).send(err || application);
    });
});

router.post('/create', (req, res) => {
    console.log('new application: ', req.body);
    var newApplication = req.body.applicationData;
    var applicantId = req.body.applicantId;
    // console.log('newApplication: ', newApplication);
    // console.log('applicantId: ', applicantId);
    Application.createApp(newApplication, (err, application) => {
        console.log('application: ', application);
        if (err) {
            res.status(400).send(err);
        } else {
            User.addApplication(applicantId, application._id, (error, updateUser) => {
                if (error) return res.status(400).send(error);
                var responseData = {
                    newApplication: application,
                    updatedApplicant: updateUser
                }
                res.send(responseData);
            });
        }
    });
});

router.put('/:id', (req, res) => {
    Application.updateApp(req.params.id, req.body, (err, updatedApplication) => {
        res.status(err ? 400 : 200).send(err || updatedApplication);
    });
});

router.delete('/:userId/delete/:appId', (req, res) => {
    Application.deleteApp(req.params.userId, req.params.appId, (err, deletedApplication) => {
        res.status(err ? 400 : 200).send(err || deletedApplication);
    });
});

module.exports = router;
