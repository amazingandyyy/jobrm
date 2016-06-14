"use strict";

var app = angular.module("jobrmApp", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
    // .state(home)
        .state(dashboard)

    $urlRouterProvider.otherwise("/");
});



let dashboard = {
    name: 'dashboard',
    url: '/',
    views: {
        main: {
            templateUrl: '/html/dashboard.html',
            controller: 'dashboardCtrl'
        },
        'applications': {
            templateUrl: '/html/dashboard_applications.html',
            controller: 'dashboardApplicationsCtrl'
        },
        'tasks': {
            templateUrl: '/html/dashboard_tasks.html',
            controller: 'dashboardTasksCtrl'
        },
        'details': {
            templateUrl: '/html/dashboard_details.html',
            controller: 'dashboardDetailsCtrl'
        }

    }
}
