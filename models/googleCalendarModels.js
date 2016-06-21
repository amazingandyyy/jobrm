"use strict";

const requestNPM = require("request");
const User = require("./user");

const googleCalendarOperations = {
    //returns the created calendar REMEMBER:
    // save the calendar ID (will be needed when creating calendar entries)and etag
    createNewCalendar: function (requestData, callback) {
        let userData = requestData.userData;
        let calendarData = requestData.calendarData;
        let accessToken = userData.identities[0].access_token;
        let requestBody = {
            "summary": [
                calendarData.calendarTitle
            ]
        };
        let options = {
            url: `https://www.googleapis.com/calendar/v3/calendars?key=AIzaSyAW4CgLvkN49dw_BrzhIOq4xnM3ueKOMfY`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            body: requestBody
        };
        requestNPM(options, function (error, httpResponse, body) {
            if (error || !body.id) return callback(error);
            console.log("Error after POST: ", error);
            console.log("body after POST: ", body);
            User.findById(requestData.mongooseId, (error, databaseUser) => {
                if (error || !databaseUser) return callback(error || "There is no user");
                databaseUser.googleCalendarData.id = body.id;
                databaseUser.googleCalendarData.etag = body.etag;
                databaseUser.googleCalendarData.summary = body.summary;
                databaseUser.save((error, savedUser) => {
                   callback(error, savedUser);
                });
            });
        });
    },
    
    calendarNewEvent: function (requestData, callback) {
        let userData = requestData.userData;
        let calendarData = requestData.calendarData;
        let accessToken = userData.identities[0].access_token;
        let requestBody = {
            "end": {
                //in YYYY-MM-DD format
                //Can use other formats
                "date": calendarData.newEndDate
            },
            "start": {
                "date": calendarData.newStartDate
            },
            "description": calendarData.description,
            "summary": calendarData.title
        };
        let options = {
            url: `https://www.googleapis.com/calendar/v3/calendars/${calendarData.calendarId}/events?key=AIzaSyAW4CgLvkN49dw_BrzhIOq4xnM3ueKOMfY`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            body: requestBody
        };
        requestNPM(options, function (error, httpResponse, body) {
            console.log("Error after POST: ", error);
            console.log("body after POST: ", body);
            callback(error, body);
        });
    }
    
};

module.exports = googleCalendarOperations;