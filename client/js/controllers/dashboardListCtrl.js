"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardListCtrl", dashboardListCtrl)

function dashboardListCtrl($scope, Application, $timeout, $state, store, $location) {
    console.log("dashboardListCtrl loaded");

    Application.getAllApplications().then(res => {
        // console.log('res: ', res.data)
        $scope.applications = res.data.reverse();
        $scope.createTime = (time) => {
            return moment(time).calendar(null, {
                sameDay: 'h:mm a, [Today]',
                nextDay: 'h:mm a, [Tomorrow]',
                nextWeek: 'next dddd MM/DD',
                lastDay: 'h:mm a, [Yesterday]',
                lastWeek: 'ddd. MM/DD/YY',
                sameElse: 'MM/DD/YY'
            });
        }
    }, err => {
        console.log('err when getting all applications: ', err);
    })
}
