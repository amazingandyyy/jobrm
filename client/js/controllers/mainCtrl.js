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


function mainCtrl($anchorScroll, $timeout, Application, $scope, $window, auth, $state, store, $location, GoogleCalendarServices, UserService, toaster) {
    console.log("mainCtrl loaded");


    (function() {
        console.log("Current user to check: ", $scope.currentUser);
        if ($scope.currentUser && !store.get("id_token") && !store.get("googleAPIAccess") && !store.get("currentUserMId")) {
            toaster.pop('warning', `Your session has ended`, `Please login again.`);
            logoutUserFromLocalDB();
            $scope.currentUser = null;
            $state.go('dashboard');
            $window.location.reload();
            console.log("Current User after null: ", $scope.currentUser);
        }
    }());


    $scope.scrollTo = function(id) {
        console.log(id);
        $location.hash(id);
        $anchorScroll();
    };
    $scope.pop = () => {
        console.log('rrr');
        toaster.pop('success', `Hi, ${$scope.currentUser.name}`, `you are logged in as ${$scope.currentUser.email}`);
    };
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
        // // console.log('$window.innerWidth: ', $window.innerWidth);
        if ($window.innerWidth < 642) {
            $scope.hideLeftSide = !$scope.hideLeftSide;
        }
    };
    if (store.get("currentUser")) {
        $scope.currentUser = store.get("currentUser")
            // console.log("Profile info: ", $scope.currentUser)
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
            //for use in Google API operations. Will have to likely store somewhere else
            //It gets generated on each login.
            store.set("googleAPIAccess", profile);
            $location.path("/dashboard");
            toaster.pop('success', `Hi, ${profile.name.split(' ')[0]}`, `you are logged in as ${profile.email}`);
            saveUserToModel(profile);
            //$scope.currentUser = profile;
        }, function(error) {
            // console.log("Error: ", error);
        })
    };
    //user logout
    $scope.logout = function() {
        auth.signout();
        store.remove("currentUserMId");
        store.remove("id_token");
        store.remove("googleAPIAccess");
        logoutUserFromLocalDB();
        $scope.currentUser = null;
        $state.go('dashboard')
        $window.location.reload();
        toaster.pop('success', `Logout successfully.`, `You are now logged out, keep in touch.`);
    };
    //save user to local Schema.
    function saveUserToModel(profile) {
        UserService.savedUser(profile)
            .then(res => {
                store.set('currentUserMId', res.data._id);
                getCurrentUser();

            })
            .catch(error => {
                // console.log('error:', error);
            });
    }

    function logoutUserFromLocalDB() {
        UserService.logout()
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log('error while loging out user', err);
            });
    }

    function getCurrentUser() {
        var userId = store.get('currentUserMId');
        if (store.get('currentUserMId')) {
            UserService.getOne(userId)
                .then(res => {
                    store.set('currentUserMId', res.data._id);
                    $scope.currentUser = res.data;
                    //create a new sub-Calendar in Google Calendar if there isn't one (For new users);
                    if (!res.data.googleCalendarData.id) {
                        GoogleCalendarServices.createNewCalendar(store.get("googleAPIAccess"), store.get("currentUserMId"))
                            .then((response) => {
                                console.log("Response after creation: ", response);
                            })
                            .catch((error) => {
                                console.log("Error: ", error);
                            });
                    }
                })
                .catch(error => {
                    // console.log('error:', error);
                });
        }
    }
    $scope.introData = [
        {
            className: "first",
            title: "Each job application is more than just a process.",
            discription: "They each are their own narratives."
        },
        {
            className: "second",
            title: "Keep track of every milestone.",
            discription: "JSM will add to the timeline of each job narrative as you advance past milestones, such as your first telephonic screen interview or your first culture-fit interview."
        },
        {
            className: "third",
            title: "Your upcoming milestones are with you everywhere you go.",
            discription: "JSM calendars and updates each milestone and event in your personal Google calendar."
        }
    ]
    $scope.authors = [
        {
            name: "Andy Chen",
            work: "Front-End, Angular",
            bio: "",
            image: "https://avatars1.githubusercontent.com/u/7886068?v=3&s=460",
            ghUrl: "https://github.com/amazingandyyy",
            lkUrl: "https://www.linkedin.com/in/amazingandyyy",
            fbUrl: "https://www.facebook.com/amazingandyyy",
            personalSite: "http://amazingandyyy.github.io/"
        },
        {
            name: "Dave Lee",
            work: "D3, Email&SMS API",
            bio: "",
            image: "https://avatars0.githubusercontent.com/u/7968378?v=3&s=460",
            ghUrl: "https://github.com/march-dave",
            lkUrl: "https://www.linkedin.com/in/dave-lee-a171845",
            fbUrl: "",
            personalSite: ""
        },
        {
            name: "David Urbina",
            work: "Front-end and Back-end API, Google API, Authentication",
            bio: "",
            image: "https://avatars2.githubusercontent.com/u/16375138?v=3&s=460",
            ghUrl: "https://github.com/WindUpDurb",
            lkUrl: "https://www.linkedin.com/in/david-urbina-589327b9",
            fbUrl: "",
            personalSite: "http://www.windupdurb.com/"
        },
        {
            name: "Tsinat Zeree",
            work: "Database, MongoDB",
            bio: "",
            image: "https://avatars2.githubusercontent.com/u/11866441?v=3&s=460",
            ghUrl: "https://github.com/tsinat",
            lkUrl: "https://www.linkedin.com/in/tsinat",
            fbUrl: "",
            personalSite: "http://tsinatzeree.com/"
        }
    ]
}

//uncomment to have an automatic call to retrieve a list of the User's messages
// Was Used to test Gmail Calls/Routes

// // console.log('$scope.currentUser: ', $scope.currentUser);
//uncomment to have an automatic call to retrieve a list of the User's messages
// Was Used to test Gmail Calls/Routes
/*GmailServices.retrieveInboxList(profileInfo)
    .then(function (res) {
        // console.log("res: ", res.data)
    })
    .catch(function(error) {
        // console.log("Error: ", error);
    });*/
/*GmailServices.createNewLabel(profileInfo)
    .then(function (res) {
        // console.log("res", res.data);
    })
    .catch(function (error) {
        // console.log("Error: ", error);
    });*/
/* GmailServices.addLabelToEmail(profileInfo)
     .then(function (res) {
         // console.log("res: ", res.data);
     })
     .catch(function (error) {
         // console.log("Error: ", error);
     })*/
/*GoogleCalendarServices.createNewCalendar(profileInfo)
    .then(function (res) {
        // console.log("res: ", res);
    })
    .catch(function (error) {
        // console.log("Error: ", error);
    })*/
/*GoogleCalendarServices.calendarNewEvent(profileInfo)
    .then(function (res) {
        // console.log("res: ", res);
    })
    .catch(function (error) {
        // console.log("Error: ", error);
    });*/
