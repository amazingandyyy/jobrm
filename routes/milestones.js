"use strict";

const express = require("express");
const router = express.Router();

const Application = require('../models/application');
const Milestone = require('../models/milestone');

router.post('/', (req, res) => {
    let applicationId = req.body.applicationId;
    let milestoneObj = req.body.milestoneObj;
    Milestone.createMilestone(milestoneObj, applicationId, (err, savedApplication) => {
        res.status(err ? 400: 200).send(err || savedApplication);
    });
});
