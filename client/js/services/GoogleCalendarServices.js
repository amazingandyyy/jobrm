angular
    .module("jobrmApp")
    .service("GoogleCalendarServices", GoogleCalendarServices);

function GoogleCalendarServices($http) {

    this.createNewCalendar = function (profileData) {
        let toSend = {
            userData: profileData,
            calendarData: {
                calendarTitle: "ShitShit"
            }
        };
        return $http({
            method: "POST",
            url: "/api/googleCalendar/createNewCalendar",
            data: toSend
        })
    };

    this.calendarNewEvent = function (profileData) {
        let toSend = {
            userData: profileData,
            calendarData: {
                calendarID: "e8jvh6sc86rto279du0nf1v1fo@group.calendar.google.com",
                newEndDate: "2016-06-19",
                newStartDate: "2016-06-19",
                description: "This going to be a test event",
                title: "Fuh Test"
            }
        };
        return $http({
            method: "POST",
            url: "/api/googleCalendar/calendarNewEvent",
            data: toSend
        });
    }

}