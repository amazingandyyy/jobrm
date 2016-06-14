"use strict";

var app = angular.module("jobrmApp", ["ui.router"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        // .state(home)
        .state(dashboard)
        .state(dashboard_applications)
        .state(dashboard_tasks)
        .state(dashboard_details)

    $urlRouterProvider.otherwise("/");
});



let dashboard = {
    name: 'dashboard',
    url: '/dashboard',
    views: {
        main: {
            templateUrl: '/html/dashboard.html',
            controller: 'dashboardCtrl'
        },
        applications: {
            templateUrl: '/html/dashboard_applications.html'
        }
    }
}

let dashboard_applications = {
    name: 'applications',
    parent:'dashboard',
    views: {
        applications: {
            templateUrl: '/html/dashboard_applications.html',
            controller: 'dashboardApplicationsCtrl'
        }
    }
}
let dashboard_tasks = {
    name: 'tasks',
    parent:'dashboard',
    views: {
        tasks: {
            templateUrl: '/html/dashboard_tasks.html',
            controller: 'dashboardTasksCtrl'
        }
    }
}
let dashboard_details = {
    name: 'details',
    parent:'dashboard',
    views: {
        tasks: {
            templateUrl: '/html/dashboard_details.html',
            controller: 'dashboardDetailsCtrl'
        }
    }
}
