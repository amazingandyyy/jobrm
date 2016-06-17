"use strict";

const express = require("express");
const router = express.Router();

const gmailAPI = require("../models/gmailAPIModels");

router.get("/test", function (request, response) {
    response.send("Working")
});

router.put("/getMessagesList", function (request, response) {
     gmailAPI.getMessagesList(request.body, function (error, responseObject, data) {
         if (error) response.status(400).send(error);
         console.log('data')
         response.send(data);
     });
});

module.exports = router;
