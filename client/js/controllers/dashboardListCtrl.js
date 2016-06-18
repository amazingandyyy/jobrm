"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardListCtrl",dashboardListCtrl)

function dashboardListCtrl($scope, Application, $timeout, $state, store){
    console.log("dashboardListCtrl loaded");
    if(store.get('logedUser') !== null){
        Application.getAllApplications().then(res => {
            // console.log('res: ', res.data)
            $scope.applications = res.data.reverse();
            $scope.createTime = (time) => {
                return moment(time).format('LT')
            }
        }, err => {
            console.log('err when getting all applications: ', err);
        })

    }
}
