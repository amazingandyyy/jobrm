"use strict";

var app = angular.module("nameOfApp", ["ui.router"]);

app.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state("home", {
            url : "/"
        })


    $urlRouterProvider.otherwise("/");
});