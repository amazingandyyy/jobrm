"use strict";

const express = require("express");
const router = express.Router();
const Application = require('../models/application');
const User = require('../models/user');

router.get('/all/:applicantId', (req, res) => {
    console.log('applicantId:', req.params.applicantId);
    Application.getAll(req.params.applicantId, (err, allApplications) => {
        res.status(err ? 400 : 200).send(err || allApplications);
    });
});
router.delete('/all', (req, res) => {
    Application.remove({}, (err, allApplications) => {
        res.status(err ? 400 : 200).send(err || allApplications);
    });
});

router.get('/:id', (req, res) => {
    Application.getOne(req.params.id, (err, application) => {
        res.status(err ? 400 : 200).send(err || application);
    });
});

router.post('/create', (req, res) => {
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
                let responseData = {
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
