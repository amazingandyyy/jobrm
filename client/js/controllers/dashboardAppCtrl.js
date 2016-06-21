"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAppCtrl", dashboardAppCtrl)

function dashboardAppCtrl($stateParams, $scope, Application, $timeout, $state, store, $location) {
    console.log("dashboardAppCtrl loaded");

    if ($stateParams.applicationId) {
        console.log('applicationId: ', $stateParams.applicationId);
        Application.getOneApplication($stateParams.applicationId).then(res => {
            console.log('res: ', res.data);
            $scope.application = res.data
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }

    $scope.stoneTemplate = [
        {
            title: "Initial Response"
        },
        {
            title: "Response"
        },
        {
            title: "Phone Screen"
        },
        {
            title: "Notes"
        },
        {
            title: "Culture-Fit Interview(s)"
        },
        {
            title: "Technical Interview(s)"
        },
        {
            title: "General interview(s)"
        }
    ]


}
