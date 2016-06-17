"use strict";

angular
    .module("jobrmApp")
    .service("GmailServices", GmailServices);

function GmailServices($http) {
    this.retrieveInboxList = function (profileInfo) {
        let toSend = {};
        toSend.profile = profileInfo;
        toSend.accessToken = profileInfo.identities[0].access_token;
        return $http({
            method: "PUT",
            url: "/api/gmailAPI/introduction/getMessageList",
            data: toSend
        });
    };
}

