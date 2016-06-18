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


function mainCtrl($scope, $window, auth, $state, store, $location, GmailServices, UserService) {
    $scope.hide = true;
    console.log("mainCtrl loaded");
    $scope.toggle = () => {
        $scope.hide = !$scope.hide;
    };
    $scope.toggle_mobile = () => {
        console.log('$window.innerWidth: ', $window.innerWidth);
        if ($window.innerWidth < 642) {
            $scope.hide = !$scope.hide;
        }
    };
    //auth profile
    $scope.auth = auth;


    //user sign-in
    $scope.signIn = function() {
        auth.signin({}, function(profile, token) {
            store.set("profile", profile);
            store.set("id_token", token);
            $location.path("/");
            //current user = auth.profile;
            saveUserToModel(profile);
            // $scope.currentUser = store.get("profile");
        }, function(error) {
            console.log("Error: ", error);
        })
    };
    //user logout
    $scope.logout = function() {
        auth.signout();
        store.remove("profile");
        store.remove("id_token");
        store.remove('loggedUser');
        $scope.currentUser = null;
    };
    //save user to local Schema.
    function saveUserToModel(profile) {
        UserService.savedUser(profile)
            .then(response => {
                console.log('response:', response);
                store.set('loggedUser', response.data);
                $scope.currentUser = store.get("loggedUser");
                if ($scope.currentUser) {
                    console.log('$scope.currentUser: ', $scope.currentUser);
                }
            })
            .catch(error => {
                console.log('error:', error);
            });
    }

    if (store.get("profile")) {
        let profileInfo = store.get("profile");
        console.log('profileInfo: ', profileInfo);
        //uncomment to have an automatic call to retrieve a list of the User's messages
        // Was Used to test Gmail Calls/Routes
        GmailServices.retrieveInboxList(profileInfo)
            .then(function(response) {

                console.log("Response: ", response.data)
            })
            .catch(function(error) {
                console.log("Error: ", error);
            });
    }

}
