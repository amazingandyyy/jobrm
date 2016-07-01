"use strict";

const express = require("express");
const router = express.Router();

const GoogleCalendarOperations = require("../models/googleCalendarModels");
const User = require("../models/user");

router.post("/createNewCalendar", (request,response) => {
    console.log("Request.body: ", request.body);
    GoogleCalendarOperations.createNewCalendar(request.body, (error, calendarData) => {
        if (error) response.status(400).send(error);
        response.send(calendarData);
    });
});

router.post("/verifyToken", (request, response) => {
    GoogleCalendarOperations.verifyToken(request.body, (error, returnData) => {
        if (error) response.status(400).send(error);
        response.send(returnData);
    });
});

router.post("/deleteCalendaredEvent", (request, response) => {
    GoogleCalendarOperations.deleteCalendaredEvent(request.body, (error, outcome) => {
        if (error) response.status(400).send(error);
        response.send(outcome);
    });
});

router.post("/retrieveEventsFromGoogle", (request, response) => {
     GoogleCalendarOperations.retrieveEvents(request.body, (error, eventsData) => {
        if (error) response.status(400).send(error);
         response.send(eventsData);
     });
});

router.post("/retrieveEventsFromDatabase", (request, response) => {
    User.findById(request.body.mongooseId, (error, databaseUser) => {
        if (error || !databaseUser || !databaseUser.googleCalendarData) response.status(400).send(error || { error: "There is no user." });
        response.send(databaseUser.googleCalendarData);
    }); 
});

router.post("/calendarNewEvent", (request, response) => {
    console.log("Request.body in hurr: ", request.body);
    GoogleCalendarOperations.calendarNewEvent(request.body, (error, calendarData) => {
        if (error) response.status(400).send(error);
        response.send(calendarData);
    });
});

module.exports = router;