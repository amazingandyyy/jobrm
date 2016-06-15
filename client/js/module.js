"use strict";

var app = angular.module("jobrmApp", ["ui.router"]);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state(dashboard)
        .state(task)
        .state(addApplication)

    $urlRouterProvider.otherwise("/dashboard");
});



let dashboard = {
    name: 'dashboard',
    url: '/dashboard',
    views: {
        'applications': {
            templateUrl: '/html/dashboard_applications.html',
            controller: 'dashboardApplicationsCtrl'
        },
        'task': {
            templateUrl: '/html/dashboard_applications_summary.html',
            controller: 'dashboardApplicationsCtrl'
        }
    }
}
let task = {
    name: 'task',
    url: '/task/:applicationId',
    views: {
        'applications': {
            templateUrl: '/html/dashboard_applications.html',
            controller: 'dashboardApplicationsCtrl'
        },
        'task': {
            templateUrl: '/html/dashboard_task.html',
            controller: 'dashboardApplicationCtrl'
        },
        'details': {
            templateUrl: '/html/dashboard_details.html',
            controller: 'dashboardApplicationCtrl'
        }

    }
}
let addApplication = {
    name: 'addApplication',
    url: '/create',
    views: {
        'applications': {
            templateUrl: '/html/dashboard_applications.html',
            controller: 'dashboardApplicationsCtrl'
        },
        'task': {
            templateUrl: '/html/dashboard_add.html',
            controller: 'dashboardApplicationCtrl'
        }

    }
}
