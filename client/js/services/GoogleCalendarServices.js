angular
    .module("jobrmApp")
    .service("GoogleCalendarServices", GoogleCalendarServices);

function GoogleCalendarServices($http) {
    
    this.verifyToken = (userData) => {
        let toSend = {userData: userData};
        return $http({
           method: "POST",
            url: "/api/googleCalendar/verifyToken",
            data: userData
        });
    };

    this.createNewCalendar = (userData, mongooseId) => {
        let toSend = {
            userData: userData,
            calendarData: {
                calendarTitle: "Active Job Pursuits"
            },
            mongooseId: mongooseId
        };
        return $http({
            method: "POST",
            url: "/api/googleCalendar/createNewCalendar",
            data: toSend
        });
    };

    this.retrieveEventsFromGoogle = (mongooseId, userData) => {
        let toSend = {
            mongooseId: mongooseId,
            userData: userData
        };
        return $http.post("/api/googleCalendar/retrieveEventsFromGoogle", toSend);
    };

    this.retrieveEventsFromMongoose = (mongooseId, idToken) => {
        return $http({
            url: "/api/googleCalendar/retrieveEventsFromDatabase",
            method: "POST",
            data: {mongooseId: mongooseId},
            headers: {
                "Authorization": `Bearer ${idToken}`
             }
         });
    };
    //createForecast uses the data and schema in Mongoose
    this.create7DayForecast = (eventsData) => {
        let sevenDayForecast = [];
        console.log("Events Data to do stuff with: ", eventsData)
        for (let i = 0; i < eventsData.length; i++) {
            let calendaredEventDate = eventsData[i].startDate.split(",")[0];
            let calendaredEventTime = eventsData[i].startDate.split(",")[1];
            console.log("The event: ", calendaredEventTime);
            let sevenDaysFromNow = moment().add(7, "day");
            console.log("Seven days from now: ", sevenDaysFromNow)

            console.log("Difference: ", sevenDaysFromNow.diff(calendaredEventDate, "days", true))
            //third argument is true so that the difference isn't rounded
            if (sevenDaysFromNow.diff(calendaredEventDate, "days", true) < 7 && sevenDaysFromNow.diff(calendaredEventDate, "days", true) >= 0) {
                sevenDayForecast.push(eventsData[i]);
            }
        }

        return sevenDayForecast;
    };

    this.deleteCalendaredEvent = (mongooseId, milestoneId, userData) => {
        let toSend = {
            mongooseId: mongooseId,
            milestoneId: milestoneId,
            userData: userData
        };
        return $http.post("/api/googleCalendar/deleteCalendaredEvent", toSend);
    };

    this.calendarNewEvent = (userData, mongooseId, calendarData) => {
        let toSend = {
            userData: userData,
            calendarData: calendarData,
            mongooseId: mongooseId
        };

        return $http({
            method: "POST",
            url: "/api/googleCalendar/calendarNewEvent",
            data: toSend
        });
    };

}
