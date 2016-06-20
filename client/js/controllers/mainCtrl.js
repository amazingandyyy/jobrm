"use strict";

angular
    .module("jobrmApp")
    .controller("mainCtrl", mainCtrl)
    // .directive('resizer', function($window) {
    //     return {
    //         restrict: 'A',
    //         link: function(scope, elem, attrs) {
    //             angular.element($window).on('resize', function() {
    //                 scope.$apply(function() {
    //                     scope.isMobile = $window.innerWidth < 600 ? true : false;
    //                 })
    //             });
    //         }
    //     }
    // })


function mainCtrl($timeout, Application, $scope, $window, auth, $state, store, $location, GmailServices, GoogleCalendarServices, UserService) {
    console.log("mainCtrl loaded");
    getCurrentUser();
    $scope.hideLeftSide = true;
    $scope.hideRightSide = true;
    $scope.hideLeftSideFunc = () => {
        $scope.hideLeftSide = !$scope.hideLeftSide;
    };
    $scope.hideRightSideFunc = () => {
        $scope.hideRightSide = !$scope.hideRightSide;
    };
    $scope.toggle_mobile = () => {
        // console.log('$window.innerWidth: ', $window.innerWidth);
        if ($window.innerWidth < 642) {
            $scope.hideLeftSide = !$scope.hideLeftSide;
        }
    };
    if (store.get("currentUser")) {
        $scope.currentUser = store.get("currentUser")
        console.log("Profile info: ", $scope.currentUser)
    }
    $scope.$watch(function() {
        return store.get("currentUser");
    }, function(newVal, oldVal) {
        $scope.currentUser = newVal;
    });

    //user sign-in
    $scope.signIn = function() {
        auth.signin({}, function(profile, token) {
            store.set("id_token", token);
            $location.path("/dashboard");
            console.log("Profile: ", profile)
            saveUserToModel(profile);
            //$scope.currentUser = profile;
        }, function(error) {
            console.log("Error: ", error);
        })
    };
    //user logout
    $scope.logout = function() {
        auth.signout();
        store.remove("currentUserMId");
        store.remove("currentUser");
        store.remove("id_token");
        $scope.currentUser = null;
        $state.go('dashboard')
        $window.location.reload();
    };
    //save user to local Schema.
    function saveUserToModel(profile) {
        UserService.savedUser(profile)
            .then(res => {
                console.log('res:', res);
                store.set('currentUserMId', res.data._id);
                getCurrentUser();
                if ($scope.currentUser) {
                    console.log('$scope.currentUser: ', $scope.currentUser);
                }
            })
            .catch(error => {
                console.log('error:', error);
            });
    }

    function getCurrentUser() {
        var userId = store.get('currentUserMId');
        if (store.get('currentUserMId')) {
            UserService.getOne(userId)
                .then(res => {
                    console.log('res:', res);
                    store.set('currentUserMId', res.data._id);
                    $scope.currentUser = res.data;
                    if ($scope.currentUser) {
                        console.log('CURRENT USER: ', $scope.currentUser);
                    }
                })
                .catch(error => {
                    console.log('error:', error);
                });
        }
    }

    if (store.get("profile")) {
        let profileInfo = store.get("profile");
        console.log('profileInfo: ', profileInfo);

        GmailServices.retrieveInboxList(profileInfo)
            .then(function(res) {
                console.log('res: ', res);
            })
    }
}

//uncomment to have an automatic call to retrieve a list of the User's messages
// Was Used to test Gmail Calls/Routes




// console.log('$scope.currentUser: ', $scope.currentUser);
//uncomment to have an automatic call to retrieve a list of the User's messages
// Was Used to test Gmail Calls/Routes
/*GmailServices.retrieveInboxList(profileInfo)
    .then(function (res) {
        console.log("res: ", res.data)
    })
    .catch(function(error) {
        console.log("Error: ", error);
    });*/
/*GmailServices.createNewLabel(profileInfo)
    .then(function (res) {
        console.log("res", res.data);
    })
    .catch(function (error) {
        console.log("Error: ", error);
    });*/
/* GmailServices.addLabelToEmail(profileInfo)
     .then(function (res) {
         console.log("res: ", res.data);
     })
     .catch(function (error) {
         console.log("Error: ", error);
     })*/
/*GoogleCalendarServices.createNewCalendar(profileInfo)
    .then(function (res) {
        console.log("res: ", res);
    })
    .catch(function (error) {
        console.log("Error: ", error);
    })*/
/*GoogleCalendarServices.calendarNewEvent(profileInfo)
    .then(function (res) {
        console.log("res: ", res);
    })
    .catch(function (error) {
        console.log("Error: ", error);
    });*/
