"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)

function dashboardCtrl($stateParams, $scope, Application, $timeout, $state, store, $location, GoogleCalendarServices) {
    console.log("dashboardCtrl loaded");
    console.log('$scope.currentUser.applications: ', $scope.currentUser.applications);
    $scope.applications = $scope.currentUser.applications.reverse();
    console.log($scope.applications);

    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');
    $scope.newApplicationSubmitted = () => {
        console.log('$scope.newApplication: ', $scope.newApplication);
        Application.createOneApplication($scope.newApplication, $scope.currentUser._id).then(res => {
            console.log('newApplication res: ', res.data);

            ///////////////////////////////Google Calendar Creation
            //replace Profile Info with the return created Application
            /*GoogleCalendarServices.createNewCalendar(profileInfo)
                .then((response) => {
                    console.log("Response: ", response);
                })
                .catch((error) => {
                    console.log("Error: ", error);
                });*/



            $state.go('application', {
                applicationId: res.data.newApplication._id
            });
            $scope.applications.unshift(res.data.newApplication)
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }
}


/*
googleCalendarData = {
    calendarId: "",
    calendarEvents: []
};*/
