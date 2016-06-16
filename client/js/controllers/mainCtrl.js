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

function mainCtrl($scope, $window, $timeout, $http, Application) {
    $scope.loginLoading = false;
    $scope.hide = true;
    console.log("mainCtrl loaded");
    $scope.toggle = () => {
        $scope.hide = !$scope.hide;
    }
    $scope.toggle_mobile = () => {
        console.log('$window.innerWidth: ', $window.innerWidth);
        if ($window.innerWidth < 642) {
            $scope.hide = !$scope.hide;
        }
    }
    $scope.syncWithGamil = () => {
        console.log('syncWithGamil triggered, message from mainCtrl');
        $scope.loginLoading = true;
        User.syncWithGamil().then(res => {
            console.log('res from syncWithGamil: ', res.data)
            // res.data shoul be the  threadId/id list
            var emailIndexList = res.data;
            emailIndexList.forEach(email=>{
                console.log('email: ', email.id);
                var id = email.id;
                $http(
                    method: 'GET',
                    data: {
                        // ...
                    }
                ).then(res=>{
                    $scope.trackingCandidateList.unshift(res.data);
                }, err=>{
                    console.log('err when get single email: ', err);
                })
            })
        }, err => {
            console.log('err when getting all applications: ', err);
        })
        $timeout(function(){
            // only for development
            // pretend to getting threadId/id list
            // next step will be, do for loop
            $scope.loginLoading = false;
        }, 2000)
    }

    $scope.logout = ()=> {
        console.log('logout triggered, message from mainCtrl');

    }
var applications = [];
    $scope.addingToTrackingList = (application) => {
        applications.push(application);
        Application.addMultipleApplications(applications).then(res => {
            console.log('res from addMultipleApplications: (thx god)', res.data)
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }
}
