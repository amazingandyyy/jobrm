"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardApplicationCtrl", dashboardApplicationCtrl)


function dashboardApplicationCtrl($stateParams) {
    console.log("dashboardApplicationCtrl loaded");
    console.log('applicationId: ', $stateParams.applicationId);
}
