"use strict";

const express = require("express");
const router = express.Router();

const gmailAPI = require("../models/gmailAPIModels");

router.put("/getMessagesList", function (request, response) {
     gmailAPI.getMessagesList(request.body, function (error, data) {
         if (error) response.status(400).send(error);
         response.send(data);
     });
});

module.exports = router;