"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)

function dashboardCtrl($stateParams, $scope, Application, $timeout, $state, store, $location) {
    console.log("dashboardCtrl loaded");
    console.log('$scope.currentUser.applications: ', $scope.currentUser.applications);
    $scope.applicationsList = $scope.currentUser.applications.reverse();
    console.log($scope.applicationsList);

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

    if ($stateParams.applicationId) {
        console.log('applicationId: ', $stateParams.applicationId);
        Application.getOneApplication($stateParams.applicationId).then(res => {
            console.log('res: ', res.data);
            $scope.application = res.data
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }

    $scope.createTime = (time) => {
        return moment(time).calendar(null, {
            sameDay: 'h:mm:ss a, [Today]',
            nextDay: 'h:mm:ss a, [Tomorrow]',
            nextWeek: 'dddd',
            lastDay: 'h:mm:ss a, [Yesterday]',
            lastWeek: 'h:mm:ss a, ddd. MMMM Do YYYY',
            sameElse: 'MM/DD/YY'
        });
    }
}
