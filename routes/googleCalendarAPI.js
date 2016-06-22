"use strict";

const express = require("express");
const router = express.Router();

const GoogleCalendarOperations = require("../models/googleCalendarModels");

router.post("/createNewCalendar", (request,response) => {
    console.log("Request.body: ", request.body);
    GoogleCalendarOperations.createNewCalendar(request.body, (error, calendarData) => {
        if (error) response.status(400).send(error);
        response.send(calendarData);
    });
});

router.post("/retrieveEvents", (request, response) => {
     GoogleCalendarOperations.retrieveEvents(request.body, (error, eventsData) => {
        if (error) response.status(400).send(error);
         response.send(eventsData);
     });
});

router.post("/calendarNewEvent", (request, response) => {
    GoogleCalendarOperations.calendarNewEvent(request.body, (error, calendarData) => {
        if (error) response.status(400).send(error);
        response.send(calendarData);
    });
});

module.exports = router;