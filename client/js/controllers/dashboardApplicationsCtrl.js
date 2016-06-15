"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardApplicationsCtrl", dashboardApplicationsCtrl)


function dashboardApplicationsCtrl($scope, Application) {
    console.log("dashboardApplicationsCtrl loaded");
    Application.getAllApplications().then(res => {
           console.log('res: ', res.data);
           $scope.applications = res.data
       }, err => {
           console.log('err when getting all applications: ', err);
       })
}
