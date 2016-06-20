"use strict";

angular
    .module("jobrmApp")
    .controller("settingCtrl", settingCtrl)

function settingCtrl($scope, $state) {
    console.log("settingCtrl loaded");
    $scope.hideLeftSide = true;
    $scope.profileSetting = angular.copy($scope.currentUser);
    $scope.profileSettingUpdated = () => {
        console.log('profileSetting: ', $scope.profileSetting);
        var profile = $scope.profileSetting;
        UserService.savedUser(profile)
            .then(res => {
                console.log('res:', res);
                store.set('currentUser', res.data);
                $scope.currentUser = res.data;
                $state.go("/dashboard");
                if ($scope.currentUser) {
                    console.log('$scope.currentUser: ', $scope.currentUser);
                }
            })
            .catch(error => {
                console.log('error:', error);
            });
    }
}
