"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)

function dashboardCtrl($stateParams, $scope, Application, $timeout, $state, store, $location, GoogleCalendarServices) {
    console.log("dashboardCtrl loaded");

    $scope.applications = $scope.currentUser.applications.reverse();
    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');

    $scope.newApplicationSubmitted = () => {
        Application.createOneApplication($scope.newApplication, $scope.currentUser._id).then(afterNewAppRes => {
            console.log("Response after new narrative creation: ", afterNewAppRes);
            let calendarEntry = {
                parentNarrativeId: afterNewAppRes.data.newApplication._id,
                calendarId: afterNewAppRes.data.updatedApplicant.googleCalendarData.id,
                newEndDate: afterNewAppRes.data.newApplication.expectedInitialResponse.slice(0, 10),
                newStartDate: afterNewAppRes.data.newApplication.expectedInitialResponse.slice(0, 10),
                description: `Initial follow up with ${afterNewAppRes.data.newApplication.company} regarding ${afterNewAppRes.data.newApplication.position}`,
                title: `Initial F/U re: ${afterNewAppRes.data.newApplication.position} at ${afterNewAppRes.data.newApplication.company}`
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
    GoogleCalendarServices.retrieveEventsFromMongoose(store.get("currentUserMId"), store.get("id_token"))
        .then((response) => {
            console.log("Events data from Mongoose: ", response.data);
            if (response.data.events) {
                $scope.sevenDayForecast = GoogleCalendarServices.create7DayForecast(response.data.events);
                console.log("In controller seven day: ", $scope.sevenDayForecast)
            }
        })
        .catch((error) => {
            console.log("Error from Google Calendar: ", error);
        });

    $scope.takeToNarrative = (narrativeId) => {
        $state.go("application", {applicationId: narrativeId});
    };

    /*GoogleCalendarServices.retrieveEventsFromGoogle(store.get("currentUserMId"), store.get("googleAPIAccess"))
        .then((response) => {
            console.log("Events data from Google Calendar: ", response.data);
            if (response.data.items) {
                $scope.sevenDayForecast = GoogleCalendarServices.create7DayForecast(response.data.items);
                console.log("In controller seven day: ", $scope.sevenDayForecast)
            }
        })
        .catch((error) => {
            console.log("Error from Google Calendar: ", error);
        });*/


    $scope.createTime = (time) => {
        // console.log('checked');
        // console.log('time: ', time);
        return moment(time).calendar(null, {
            sameDay: 'h:mm a, [Today]',
            nextDay: 'h:mm a, [Tomorrow]',
            nextWeek: 'dddd',
            lastDay: 'h:mm:ss a, [Yesterday]',
            lastWeek: 'h:mm:ss a, ddd. MMMM Do YYYY',
            sameElse: 'MM/DD/YY'
        });
    };

    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            x: function(d){ return d.label; },
            y: function(d){ return d.value; },
            showValues: true,
            valueFormat: function(d){
                return d3.format(',.4f')(d);
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: 30
            }
        }
    };

    $scope.data = [{
    key: "Cumulative Return",
    values: [
      { "label" : "A" , "value" : -29.765957771107 },
      { "label" : "B" , "value" : 0 },
      { "label" : "C" , "value" : 32.807804682612 },
      { "label" : "D" , "value" : 196.45946739256 },
      { "label" : "E" , "value" : 0.19434030906893 },
      { "label" : "F" , "value" : -98.079782601442 },
      { "label" : "G" , "value" : -13.925743130903 },
      { "label" : "H" , "value" : -5.1387322875705 }
      ]
    }]
}

/*
googleCalendarData = {
    calendarId: "",
    calendarEvents: []
};*/
