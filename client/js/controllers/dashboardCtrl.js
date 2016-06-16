"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)


function dashboardCtrl($stateParams, $scope, Application, $timeout, $state) {
    console.log("dashboardCtrl loaded");

    Application.getAllApplications().then(res => {
        // console.log('res: ', res.data)
        $scope.applications = res.data.reverse();
        $scope.createTime = (time) => {
            return moment(time).format('LT')
        }
    }, err => {
        console.log('err when getting all applications: ', err);
    })

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
                // console.log('newApplication res: ', typeof res.data)
                $state.go('task', {applicationId: res.data._id})
                console.log('$scope.applications: ', $scope.applications)
            }, err => {
                console.log('err when getting all applications: ', err);
            })
        },1)
    }

    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');
}
