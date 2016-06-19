"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardListCtrl", dashboardListCtrl)

function dashboardListCtrl($scope, Application, $timeout, $state, store, $location) {
    console.log("dashboardListCtrl loaded");
    console.log('$scope.currentUser.applications: ', $scope.currentUser.applications);
    $scope.applicationsList = $scope.currentUser.applications.reverse();

    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');
    $scope.newApplicationSubmitted = () => {
            console.log('$scope.newApplication: ', $scope.newApplication)
            Application.createOneApplication($scope.newApplication, $scope.currentUser._id).then(res => {
                console.log('newApplication res: ', res.data)
                $state.go('application', {
                    applicationId: res.data.newApplication._id
                })
                $scope.applicationsList.unshift(res.data.newApplication)
            }, err => {
                console.log('err when getting all applications: ', err);
            })
        }
}
