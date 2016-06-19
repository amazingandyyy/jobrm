"use strict";

angular
    .module("jobrmApp")
    .service("UserService", UserService);


function UserService($http){
    this.savedUser = user => {
        return $http({
            method: "POST",
            url: "/api/users",
            data: user
        });
    };
    this.getOne = (userId) => {
        return $http({
            method: "GET",
            url: `/api/users/${userId}`
        });
    };
}
