"use strict";

const express = require("express");
const router = express.Router();

const googleCalendarOperations = require("../models/googleCalendarModels");

router.post("/createNewCalendar", function (request,response) {
    googleCalendarOperations.createNewCalendar(request.body, function (error, calendarData) {
        if (error) response.status(400).send(error);
        response.send(calendarData);
    });
});

router.post("/calendarNewEvent", function (request, response) {
    googleCalendarOperations.calendarNewEvent(request.body, function (error, calendarData) {
        if (error) response.status(400).send(error);
        response.send(calendarData);
    });
});

module.exports = router;