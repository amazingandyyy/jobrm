"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardAddingCtrl", dashboardAddingCtrl)

function dashboardAddingCtrl($scope, Application, $timeout, $state, store, UserService, $window) {
    console.log("dashboardAddingCtrl loaded");
    $scope.applicationDateDefault = moment().format('YYYY-MM-DD');

    // function getCurrentUser() {
    //     var userId = store.get('currentUserMId');
    //     if(store.get('currentUserMId')){
    //         UserService.getOne(userId)
    //             .then(res => {
    //                 console.log('res:', res);
    //                 store.set('currentUserMId', res.data._id);
    //                 $scope.currentUser = res.data;
    //                 $scope.applicationsList = $scope.currentUser.applications;
    //                 if ($scope.currentUser) {
    //                     console.log('CURRENT USER AFTER UPDATING: ', $scope.currentUser);
    //                 }
    //             })
    //             .catch(error => {
    //                 console.log('error:', error);
    //             });
    //     }
    // }
}
