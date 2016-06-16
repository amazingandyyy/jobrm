"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAddingCtrl",dashboardAddingCtrl)

function dashboardAddingCtrl($scope, Application, $timeout, $state){
    console.log( "dashboardAddingCtrl loaded");
    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');
    $scope.newApplicationSubmitted = () => {
        // if(!$scope.newApplication.applicationDate){
        //     $scope.newApplication.applicationDate =  moment().format('x')
        // }
        $timeout(function(){
            console.log('$scope.newApplication: ', $scope.newApplication)
            Application.createOneApplication($scope.newApplication).then(res => {
                // console.log('newApplication res: ', typeof res.data)
                $state.go('task', {applicationId: res.data._id})
                console.log('$scope.applications: ', $scope.applications)
            }, err => {
                console.log('err when getting all applications: ', err);
            })
        },1)
    }
}
