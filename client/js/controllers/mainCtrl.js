"use strict";

angular
    .module("jobrmApp")
    .controller("mainCtrl", mainCtrl)
    .directive('resizer', function($window) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                angular.element($window).on('resize', function() {
                    scope.$apply(function() {
                        scope.isMobile = $window.innerWidth < 600 ? true : false;
                    })
                });
            }
        }
    })

function mainCtrl($scope, $window, auth, store, $location) {
    console.log("mainCtrl loaded");
    $scope.toggle = () => {
        if($window.innerWidth < 600){
            $scope.hide = !$scope.hide;
        }
    };
    //auth profile
    $scope.auth = auth;
    //current user = auth.profile;
    $scope.currentUser = auth.profile;
    //user logout
    $scope.logout = function () {
        auth.signout();
        store.remove("profile");
        store.remove("token");
        $location.path("/");
    };

    if (store.get("profile")) {
        let profileInfo = store.get("profile");
        GmailServices.retrieveInboxList(profileInfo)
            .then(function (response) {
                console.log("List of emails: ", response.data.data);
            })
            .catch(function (error) {
                console.log("Error: ", error);
            })
    }
}
