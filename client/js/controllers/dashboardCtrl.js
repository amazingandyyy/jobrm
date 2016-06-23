"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)

function dashboardCtrl($stateParams, $scope, Application, $timeout, $state, store, $location, GoogleCalendarServices) {
    // console.log("dashboardCtrl loaded");
    $scope.applications = $scope.currentUser.applications.reverse();
    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');
    $scope.newApplicationSubmitted = () => {
        Application.createOneApplication($scope.newApplication, $scope.currentUser._id).then(afterNewAppRes => {
            console.log("Response here: ", afterNewAppRes);
            let calendarEntry = {
                calendarId: afterNewAppRes.data.updatedApplicant.googleCalendarData.id,
                newEndDate: afterNewAppRes.data.newApplication.generalNarrativeData.expectedInitialResponse.slice(0, 10),
                newStartDate: afterNewAppRes.data.newApplication.generalNarrativeData.expectedInitialResponse.slice(0, 10),
                description: `Initial follow up with ${afterNewAppRes.data.newApplication.generalNarrativeData.company} regarding ${afterNewAppRes.data.newApplication.generalNarrativeData.position}`,
                title: `Initial F/U re: ${afterNewAppRes.data.newApplication.generalNarrativeData.position} at ${afterNewAppRes.data.newApplication.generalNarrativeData.company}`
            };
          GoogleCalendarServices.calendarNewEvent(store.get("googleAPIAccess"), store.get("currentUserMId"), calendarEntry)
                .then((res) => {
                    console.log("response after calendar: ", res);
                    $state.go('application', {
                        applicationId: afterNewAppRes.data.newApplication._id
                    });
                    $scope.applications.unshift(afterNewAppRes.data.newApplication)
                })
                .catch((error) => {
                    console.log("Error: ", error);
                });
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    };

    GoogleCalendarServices.retrieveEvents(store.get("currentUserMId"), store.get("googleAPIAccess"))
        .then((response) => {
            console.log("Events data from Google Calendar: ", response.data);
            $scope.sevenDayForecast = GoogleCalendarServices.create7DayForecast(response.data.items);
            console.log("In controller seven day: ", $scope.sevenDayForecast)
            
        })
        .catch((error) => {
            console.log("Error from Google Calendar: ", error);
        });

    $scope.createTime = (time) => {
        return moment(time).calendar(null, {
            sameDay: 'h:mm a, [Today]',
            nextDay: 'h:mm a, [Tomorrow]',
            nextWeek: 'dddd',
            lastDay: 'h:mm:ss a, [Yesterday]',
            lastWeek: 'h:mm:ss a, ddd. MMMM Do YYYY',
            sameElse: 'MM/DD/YY'
        });
    }


}
