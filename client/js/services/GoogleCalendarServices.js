angular
    .module("jobrmApp")
    .service("GoogleCalendarServices", GoogleCalendarServices);

function GoogleCalendarServices($http) {

    this.createNewCalendar = function (profileData, mongooseId) {
        let toSend = {
            userData: profileData,
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
    
   /* this.addCalendartoMongoose = function (response, mongooseID) {
        let toSend = {
            googleCalendarData: {
                etag: response.data.etag,
                summary: response.data.summary,
                calendarId: response.data.id
            },
            mongooseId: mongooseID
        };
    };*/

    this.calendarNewEvent = function (profileData, mongooseId, calendarData) {
        let toSend = {
            userData: profileData,
            calendarData: calendarData,
            mongooseId: mongooseId
            /*calendarData: {
                calendarID: "or970rt2b44h1gs1ern988eq48@group.calendar.google.com",
                newEndDate: newDate,
                newStartDate: newDate,
                description: `Initial follow up with ${applicationData.newApplication.generalNarrativeData.company} regarding ${applicationData.newApplication.generalNarrativeData.position}`,
                title: `Initial F/U re: ${applicationData.newApplication.generalNarrativeData.position} at ${applicationData.newApplication.generalNarrativeData.company}`
            }*/
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