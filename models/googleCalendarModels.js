"use strict";

const requestNPM = require("request");
const User = require("./user");

const googleCalendarOperations = {
    //returns the created calendar. REMEMBER:
    // save the calendar ID (will be needed when creating calendar entries)and etag
    createNewCalendar: (requestData, callback) => {
        let userData = requestData.userData;
        let calendarData = requestData.calendarData;
        let accessToken = userData.identities[0].access_token;
        let requestBody = {
            "summary": [
                calendarData.calendarTitle
            ]
        };
        let options = {
            url: `https://www.googleapis.com/calendar/v3/calendars?key=${process.env.GoogleKEY}`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            body: requestBody
        };
        requestNPM(options, (error, httpResponse, body) => {
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

    retrieveEvents: (requestData, callback) => {
        let userData = requestData.userData;
        let accessToken = userData.identities[0].access_token;
        User.findById(requestData.mongooseId, (error, databaseUser) => {
            if (error || !databaseUser) return callback(error || { error: "There is no user." });
            let options = {
                url: `https://www.googleapis.com/calendar/v3/calendars/${databaseUser.googleCalendarData.id}/events`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            requestNPM(options, (error, httpResponse, body) => {
                console.log("Error: ", error);
                console.log("Body after GET: ", body);
                callback(error, body);
            })

        });
    },

    calendarNewEvent: (requestData, callback) => {
        console.log("The request data: ", requestData);
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
            url: `https://www.googleapis.com/calendar/v3/calendars/${calendarData.calendarId}/events?key=${process.env.GoogleKEY}`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            body: requestBody
        };
        requestNPM(options, (error, httpResponse, body) => {
            if (error) return callback(error);
            console.log("Error after POST: ", error);
            console.log("body after POST: ", body);
            User.findById(requestData.mongooseId, (error, databaseUser) => {
                if (error || !databaseUser) return callback(error || { error: "There is no user." });
                let newEntry = {
                    id: body.id,
                    summary: body.summary,
                    startDate: body.start.date,
                    htmlLink: body.htmlLink,
                    description: body.description
                };
                databaseUser.googleCalendarData.events.push(newEntry);
                databaseUser.save((error, savedUser) => {
                    console.log("Saved User: ", savedUser);
                    callback(error, body);
                });
            });
        });
    }
    
};

module.exports = googleCalendarOperations;