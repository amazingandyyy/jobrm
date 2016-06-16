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

function mainCtrl($scope, $window) {
    console.log("mainCtrl loaded");
    $scope.toggle = () => {
        if($window.innerWidth < 600){
            $scope.hide = !$scope.hide;
        }
    }
}
