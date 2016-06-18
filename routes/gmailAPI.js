"use strict";

const express = require("express");
const router = express.Router();

const gmailAPI = require("../models/gmailAPIModels");

router.put("/getEmailsList", function (request, response) {
    gmailAPI.getEmails(request.body, function (error, data) {
        if (error) response.status(400).send(error);
        response.send(data);
    });
});
//returns the new label id and the summary of the label in an object
//Make sure to save the label id
router.post("/createNewLabel", function (request, response) {
    gmailAPI.createNewLabel(request.body, function (error, newLabelData) {
        if (error) response.status(400).send(error);
        response.send(newLabelData);
    });
});

router.post("/addLabelToEmail", function (request, response) {
    gmailAPI.addLabelToEmail(request.body, function (error, returnData) {
        if (error) response.status(400).send(error);
        response.send(returnData);
    }) 
});

module.exports = router;

