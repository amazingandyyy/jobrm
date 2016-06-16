"use strict";

angular
    .module("jobrmApp", ["ui.router"])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state(dashboard)
            .state(application)
            .state(addApplication)

        $urlRouterProvider.otherwise("/dashboard");
    })


let dashboard = {
    name: 'dashboard',
    url: '/dashboard',
    views: {
        'task': {
            templateUrl: '/html/dashboard_summary.html',
            controller: 'dashboardListCtrl'
        }
    }
}
let application = {
    name: 'application',
    url: '/app/:applicationId',
    views: {
        'task': {
            templateUrl: '/html/dashboard_task.html',
            controller: 'dashboardTasksCtrl'
        }
    }
}
let addApplication = {
    name: 'addApplication',
    url: '/create',
    views: {
        'task': {
            templateUrl: '/html/dashboard_add.html',
            controller: 'dashboardAddingCtrl'
        }
    }
}
