"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAddingCtrl", dashboardAddingCtrl)

function dashboardAddingCtrl($scope, Application, $timeout, $state, store) {
    console.log("dashboardAddingCtrl loaded");
    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');
    $scope.newApplicationSubmitted = () => {
        // if(!$scope.newApplication.applicationDate){
        //     $scope.newApplication.applicationDate =  moment().format('x')
        // }
        $timeout(function() {
            console.log('$scope.newApplication: ', $scope.newApplication)
            Application.createOneApplication($scope.newApplication, $scope.currentUser._id).then(res => {
                console.log('newApplication res: ', res.data)
                $state.go('application', {
                    applicationId: res.data.newApplication._id
                })
                store.set("currentUser", res.data.updatedApplicant)
            }, err => {
                console.log('err when getting all applications: ', err);
            })
        }, 1)
    }
}
