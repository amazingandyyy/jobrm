"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)

function dashboardCtrl($stateParams, $scope, Application, $timeout, $state, store, $location, GoogleCalendarServices, DashboardServices) {
    console.log("dashboardCtrl loaded");

    $scope.applications = $scope.currentUser.applications.reverse();
    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');

    $scope.newApplicationSubmitted = () => {
        Application.createOneApplication($scope.newApplication, $scope.currentUser._id).then(afterNewAppRes => {
            console.log("Response after new narrative creation: ", afterNewAppRes);
            let calendarEntry = {
                parentNarrativeId: afterNewAppRes.data.newApplication._id,
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
                return d3.format(',d')(d);
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

    let appCount = 0;
    DashboardServices.getDS3ChartUser($scope.currentUser._id)
        .then(res => {
            console.log('res.data', res.data);
            appCount = res.data.applications.length;
            AppChart(appCount);
        })
        .catch((error) => {
            console.log("Error from DS3 Calendar: ", error);
        });

    function AppChart(appCount) {
        console.log('appCountappCountappCountappCount', appCount);
        $scope.data = [{
            key: "Cumulative Return",
            values: [
                { "label" : "Applications" , "value" : appCount }
            ]
        }]
    }

}

/*
googleCalendarData = {
    calendarId: "",
    calendarEvents: []
};*/
