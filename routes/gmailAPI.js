"use strict";

const express = require("express");
const router = express.Router();

const gmailAPI = require("../models/gmailAPIModels");

router.get("/test", function (request, response) {
    response.send("Working")
});

router.put("/getMessagesList", function (request, response) {
    //modify to get a list of emails with a specific label
     gmailAPI.getMessagesList(request.body, function (error, responseObject, data) {
         if (error) response.status(400).send(error);
         response.send(data);
     });
});

router.put("/introduction/getMessageList", function (request, response) {
    gmailAPI.getMessageListIntroduction(request.body, function (error, data) {
        if (error) response.status(400).send(error);
        response.send(data);
    });
});

module.exports = router;