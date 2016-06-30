"use strict";

const requestNPM = require("request");
const User = require("./user");

const Batchelor = require("batchelor");

const googleCalendarOperations = {

    verifyToken: (requestData, callback) => {
        let accessToken = requestData.identities[0].access_token;
        console.log("Access token: ", accessToken)
        let options = {
            url: `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`,
            method: "GET"
           /* headers: {
                Authorization: `Bearer ${accessToken}`
            },*/
        };
        requestNPM(options, (error, httpResponse, body) => {
            console.log("Error: ", error);
            console.log("Body: ", body);
            return callback(error, body);   
        });
    },
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
    
    deleteEventsFromNarrative: (mongooseId, narrativeId, userData, callback) => {
        conosole.log("MongooseID: ", mongooseId);
        conosole.log("Narrative ID: ", narrativeId);
        conosole.log("USer Data: ", userData);
        let batch = new Batchelor({
            "uri": "https://www.googleapis.com/batch",
            "method": "POST",
            "auth": {
                "bearer": accessToken
            },
            "headers": {
                "Content-Type": "multipart/mixed"
            }
        });
        callback(null);
    },

    deleteCalendaredEvent: (requestData, callback) => {
        let mongooseId = requestData.mongooseId;
        let milestoneId = requestData.milestoneId;
        let accessToken = requestData.userData.identities[0].access_token;
        User.findById(mongooseId, (error, databaseUser) => {
            if (error || !databaseUser) return callback(error || { error: "There is no such user." });
            let databaseEvents = databaseUser.googleCalendarData.events;
            let eventId;
            let indexInEvents;
            for (let i = 0; i < databaseEvents.length; i++) {
                console.log("i: ", i);
                if (databaseEvents[i].milestoneId === milestoneId) {
                    eventId = databaseEvents[i].id;
                    indexInEvents = i;
                }
            }
            console.log("HEre 2")
            let options = {
                url: `https://www.googleapis.com/calendar/v3/calendars/${databaseUser.googleCalendarData.id}/events/${eventId}?key=${process.env.GoogleKEY}`,
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            console.log("HEre 3")
            console.log("Options: ", options)
            requestNPM(options, (error, responseObject, responseData) => {
                console.log("Error: ", error);
                console.log("ResponseData: ", responseData)
                if (error) return callback(error);
                databaseEvents.splice(indexInEvents, 1);
                databaseUser.googleCalendarData.events = databaseEvents;
                databaseUser.save((error, savedUser) => {
                    return callback(error, savedUser);
                })
            });
        });
    },

    calendarNewEvent: (requestData, callback) => {
        console.log("The request data: ", requestData);
        let userData = requestData.userData;
        let calendarData = requestData.calendarData;
        let mongooseId = requestData.mongooseId;
        let accessToken = userData.identities[0].access_token;

        User.findById(mongooseId, (error, databaseUser) => {
            if (error || !databaseUser) return callback(error || { error: "There is no such user." });
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
                url: `https://www.googleapis.com/calendar/v3/calendars/${databaseUser.googleCalendarData.id}/events?key=${process.env.GoogleKEY}`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                json: true,
                body: requestBody
            };
            console.log("Google Calendar requestBody: ", requestBody);
            console.log("Google Calendar Options: ", options);

            requestNPM(options, (error, httpResponse, body) => {
                if (error) return callback(error);
                console.log("Error after POST: ", error);
                console.log("body after POST: ", body);
                let newEntry = {
                    parentNarrativeId: calendarData.parentNarrativeId,
                    milestoneId: calendarData. milestoneId,
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