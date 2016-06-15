"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardApplicationsCtrl", dashboardApplicationsCtrl)


function dashboardApplicationsCtrl($scope, Application) {
    console.log("dashboardApplicationsCtrl loaded");
    Application.getAllApplications().then(res => {
        // console.log('res: ', res.data)
        $scope.applications = res.data
        $scope.createTime = (time) => {
            return moment(time).format('LT')
        }
    }, err => {
        console.log('err when getting all applications: ', err);
    })

}
