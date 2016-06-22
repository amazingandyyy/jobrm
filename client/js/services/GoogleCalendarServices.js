angular
    .module("jobrmApp")
    .service("GoogleCalendarServices", GoogleCalendarServices);

function GoogleCalendarServices($http) {

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

    this.retrieveEvents = (mongooseId, userData) => {
        let toSend = {
            mongooseId: mongooseId,
            userData: userData
        };
        return $http.post("/api/googleCalendar/retrieveEvents", toSend);
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