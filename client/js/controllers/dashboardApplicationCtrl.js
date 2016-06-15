"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardApplicationCtrl", dashboardApplicationCtrl)


function dashboardApplicationCtrl($stateParams, $scope, Application) {
    console.log("dashboardApplicationCtrl loaded");
    console.log('applicationId: ', $stateParams.applicationId);
    Application.getOneApplication($stateParams.applicationId).then(res => {
           console.log('res: ', res.data);
           $scope.application = res.data
       }, err => {
           console.log('err when getting all applications: ', err);
       })
}
