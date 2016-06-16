"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)


function dashboardCtrl($stateParams, $scope, Application, $timeout, $state) {
    console.log("dashboardCtrl loaded");

}
