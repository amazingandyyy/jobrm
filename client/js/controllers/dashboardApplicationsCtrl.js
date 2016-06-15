"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardApplicationsCtrl", dashboard_applications)


function dashboard_applications($scope, Application) {
    console.log("dashboard_applications loaded");

    // Application.getAllApplications().then(res => {
    //     console.log('res: ', res.data);
    //     $scope.applications = res.data
    // }, err => {
    //     console.log('err when getting all applications: ', err);
    // })
}
