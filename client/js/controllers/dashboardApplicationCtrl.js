"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardApplicationCtrl", dashboardApplicationCtrl)


function dashboardApplicationCtrl($stateParams, $scope, Application) {
    console.log("dashboardApplicationCtrl loaded");
    $scope.newApplication = [];
    if ($stateParams.applicationId) {
        console.log('applicationId: ', $stateParams.applicationId);
        Application.getOneApplication($stateParams.applicationId).then(res => {
            console.log('res: ', res.data);
            $scope.application = res.data
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }

    $scope.newApplicationSubmitted = () => {
        if(!$scope.newApplication.applicationDate){
            $scope.newApplication.applicationDate =  moment().format('x')
        }
        console.log('$scope.newApplication: ', $scope.newApplication);

    }

    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');
}
