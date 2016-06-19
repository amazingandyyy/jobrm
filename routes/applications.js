"use strict";

const express = require("express");
const router = express.Router();
const Application = require('../models/application');
const User = require('../models/user');

router.get('/all/:id', (req, res) => {
    console.log('id:', req.params.id);
    Application.getAll(req.params.id, (err, allApplications) => {
        res.status(err ? 400: 200).send(err || allApplications);
    });
});
router.delete('/all', (req, res) => {
    Application.remove({}, (err, allApplications) => {
        res.status(err ? 400: 200).send(err || allApplications);
    });
});

router.get('/:id', (req, res) => {
    Application.findById(req.params.id, (err, application) => {
        res.status(err ? 400: 200).send(err || application);
    });
});

router.post('/:userId', (req, res) => {
    console.log('new application: ', req.body);
    Application.createApp(req.body, (err, application) => {
        console.log('application: ', application);
        if(err){
            res.status(400).send(err);
        } else {
             User.addApplication(req.params.userId, application._id, (err2, addedApplication) => {
                 if(err2) res.status(400).send(err2);
                 res.send(application);
             });
        }
    });
});

router.put('/:id', (req, res) => {
    Application.updateApp(req.params.id, req.body, (err, updatedApplication) => {
        res.status(err ? 400: 200).send(err || updatedApplication);
    });
});

router.delete('/:userId/delete/:appId', (req, res) => {
    Application.deleteApp(req.params.userId, req.params.appId, (err, deletedApplication) => {
        res.status(err ? 400: 200).send(err || deletedApplication);
    });
});

module.exports = router;
