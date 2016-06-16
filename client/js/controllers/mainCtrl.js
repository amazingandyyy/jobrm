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
}
