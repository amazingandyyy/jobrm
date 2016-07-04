"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)

function dashboardCtrl($stateParams, $scope, Application, $timeout, $window, $state, store, $location, GoogleCalendarServices, DashboardServices, Milestone) {
    console.log("dashboardCtrl loaded");
    (function() {
        console.log("Current user to check: ", $scope.currentUser);
        if ($scope.currentUser && !store.get("id_token") && !store.get("googleAPIAccess") && !store.get("currentUserMId")) {
            toaster.pop('warning', `Your session has ended`, `Please login again.`);
            $scope.currentUser = null;
            $state.go('dashboard');
            $window.location.reload();
            console.log("Current User after null: ", $scope.currentUser);
        }
    }());
    $scope.newApplication = {};
    $scope.applications = $scope.currentUser.applications.reverse();
    let todayDate = moment(Date.now());
    let applicationDefaultDate = new Date().toISOString().split("T")[0];
    let expectedInitialDefaultDate = moment(applicationDefaultDate).add(7, 'day')._d.toISOString().split("T")[0];
    $scope.newApplication.applicationDate = new Date(applicationDefaultDate);
    $scope.newApplication.expectedInitialResponse = new Date(expectedInitialDefaultDate);
    // .toISOString().split("T")[0];
    $scope.newApplicationSubmitted = () => {
        Application.createOneApplication($scope.newApplication, $scope.currentUser._id).then(afterNewAppRes => {
            let newCalendarDate = moment($scope.newApplication.expectedInitialResponse).format("YYYY-MM-DD");
            let calendarEntry = {
                parentNarrativeId: afterNewAppRes.data.newApplication._id,
                newEndDate: newCalendarDate,
                newStartDate: newCalendarDate,
                description: `Initial follow up with ${afterNewAppRes.data.newApplication.company} regarding ${afterNewAppRes.data.newApplication.position}`,
                title: `Initial F/U re: ${afterNewAppRes.data.newApplication.position} at ${afterNewAppRes.data.newApplication.company}`
            };
          GoogleCalendarServices.calendarNewEvent(store.get("googleAPIAccess"), store.get("currentUserMId"), calendarEntry)
                .then((res) => {
                    $state.go('application', {
                        applicationId: afterNewAppRes.data.newApplication._id
                    });
                    $scope.applications.unshift(afterNewAppRes.data.newApplication)
                })
                .catch((error) => {
                    console.log("Error: ", error);
                });
        }, err => {
            console.log('err when creating a new application: ', err);
        })
    };
    GoogleCalendarServices.retrieveEventsFromMongoose(store.get("currentUserMId"), store.get("id_token"))
        .then((response) => {
            if (response.data.events) {
                console.log("Events: ", response.data.events);
                $scope.sevenDayForecast = GoogleCalendarServices.create7DayForecast(response.data.events);
            }
        })
        .catch((error) => {
            console.log("Error from Google Calendar: ", error);
        });

    $scope.takeToNarrative = (narrativeId) => {
        $state.go("application", {
            applicationId: narrativeId
        });
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
            margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            x: function(d) {
                return d.label;
            },
            y: function(d) {
                return d.value;
            },
            showValues: true,

            valueFormat: function(d){
                return d3.format('d')(d);
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

    let appCount = 0, appDateArr = [], appDate;

    DashboardServices.getDS3ChartUser($scope.currentUser._id)
        .then(res => {
            appCount = res.data.applications.length;
            appDate = res.data.applications;

            var count = 0;
            var objArr = [];
            appDate.map( c => {

                var isExist = appDateArr.some( c2 => {
                    if ( c.applicationDate.slice(0, 10) ==  c2 ) {
                        count++;
                        return true;
                    }
                });

                if (!isExist) {
                    appDateArr.push(c.applicationDate.slice(0, 10));
                }

                count++;

                obj = {
                    "label" : c.applicationDate.slice(0, 10),
                    "value": count
                };

                objArr.push(obj);
                count = 0;
            });

            var obj = { };

            appChart(objArr);
        })
        .catch((error) => {
            console.log("Error from DS3 Calendar: ", error);
        });

    function appChart(objArr) {
        $scope.data = [{
            key: "Cumulative Return",
            values: objArr
        }]
    }

}
