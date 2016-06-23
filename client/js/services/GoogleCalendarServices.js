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

    this.create7DayForecast = (eventsData) => {
        let sevenDayForecast = [];
        for (let i = 0; i < eventsData.length; i++) {
            let calendaredEvent = eventsData[i].start.date;
            let sevenDaysFromNow = moment().add(7, "day");
            //third argument is true so that the difference isn't rounded
            if (sevenDaysFromNow.diff(calendaredEvent, "days", true) < 7 && sevenDaysFromNow.diff(calendaredEvent, "days", true) >= 0) {
                sevenDayForecast.push(eventsData[i]);
            }
        }
        console.log("Seven Day Forecast: ", sevenDayForecast);
        return sevenDayForecast;
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