"use strict";

angular
    .module("jobrmApp")
    .controller("settingCtrl", settingCtrl)

function settingCtrl($scope, $state, UserService, store) {
    console.log("settingCtrl loaded");
    $scope.hideLeftSide = true;
    $scope.profileSetting = angular.copy($scope.currentUser);
    
    $scope.profileSettingUpdated = () => {
        UserService.savedUser($scope.profileSetting)
            .then(res => {
                store.set('currentUser', res.data);
                $scope.currentUser = res.data;
                $state.go("dashboard");
                if ($scope.currentUser) {
                    console.log('$scope.currentUser: ', $scope.currentUser);
                }
            })
            .catch(error => {
                console.log('error:', error);
            });
    }
}
