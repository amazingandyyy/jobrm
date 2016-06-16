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

function mainCtrl($scope, $window, auth, store, $location, GmailServices) {
    console.log("mainCtrl loaded");
    $scope.toggle = () => {
        if($window.innerWidth < 600){
            $scope.hide = !$scope.hide;
        }
    };
    //auth profile
    $scope.auth = auth;
    //current user = auth.profile;
    $scope.currentUser = store.get("profile");
    //user sign-in
    $scope.signIn = function () {
        auth.signin({}, function (profile, token) {
            store.set("profile", profile);
            store.set("id_token", token);
            $location.path("/");
        }, function (error) {
            console.log("Error: ", error);
        })
    };
    //user logout
    $scope.logout = function () {
        auth.signout();
        store.remove("profile");
        store.remove("token");
        $location.path("/");
    };

    if (store.get("profile")) {
        let profileInfo = store.get("profile");
        console.log(profileInfo);
        //uncomment to have an automatic call to retrieve a list of the User's messages
        // Was Used to test Gmail Calls/Routes
     /*   GmailServices.retrieveInboxList(profileInfo)
            .then(function (response) {
                console.log("Response: ", response.data)
            })
            .catch(function (error) {
                console.log("Error: ", error);
            });*/
    }

}
