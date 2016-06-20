angular
    .module("jobrmApp")
    .service("GoogleCalendarServices", GoogleCalendarServices);

function GoogleCalendarServices($http) {

    this.createNewCalendar = function (profileData) {
        let toSend = {
            userData: profileData,
            calendarData: {
                calendarTitle: "Active Job Pursuits"
            }
        };
        return $http({
            method: "POST",
            url: "/api/googleCalendar/createNewCalendar",
            data: toSend
        })
    };

    this.calendarNewEvent = function (applicationData, profileData) {
        let newDate = applicationData.newApplication.generalNarrativeData.expectedInitialResponse.slice(0, 10);
        let toSend = {
            userData: profileData,
            calendarData: {
                calendarID: "ahpohcmtu00nit5cqto302l738@group.calendar.google.com",
                newEndDate: newDate,
                newStartDate: newDate,
                description: `Initial follow up with ${applicationData.newApplication.generalNarrativeData.company} regarding ${applicationData.newApplication.generalNarrativeData.position}`,
                title: `Initial F/U re: ${applicationData.newApplication.generalNarrativeData.position} at ${applicationData.newApplication.generalNarrativeData.company}`
            }
        };

/*
        console.log("Application Data: ", applicationData);
       // console.log("To send: ", toSend);
        console.log("New date to calendar: ", moment())
        console.log("initial date: ", applicationData.newApplication.generalNarrativeData.expectedInitialResponse);
*/
        return $http({
            method: "POST",
            url: "/api/googleCalendar/calendarNewEvent",
            data: toSend
        });
    }

}