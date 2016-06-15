"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardApplicationCtrl", dashboardApplicationCtrl)


function dashboardApplicationCtrl($stateParams, $scope, Application, $timeout) {
    console.log("dashboardApplicationCtrl loaded");
    $scope.newApplication = {};
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
        // if(!$scope.newApplication.applicationDate){
        //     $scope.newApplication.applicationDate =  moment().format('x')
        // }
        $timeout(function(){
            console.log('$scope.newApplication: ', $scope.newApplication)
            Application.createOneApplication($scope.newApplication).then(res => {
                console.log('res: ', res.data)
                $scope.application = res.data
            }, err => {
                console.log('err when getting all applications: ', err);
            })
        },1)
    }

    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');
}
