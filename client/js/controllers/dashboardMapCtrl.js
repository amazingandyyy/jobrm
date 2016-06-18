"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardMapCtrl", dashboardMapCtrl)


function dashboardMapCtrl($stateParams, $scope, Application, $timeout, $state) {
    console.log("dashboardMapCtrl loaded");
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
        // hh:mm:ss,
    }
}
