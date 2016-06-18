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
            url: "/api/gmailAPI/getEmailsList",
            data: toSend
        });
    };
    
    this.createNewLabel = function (profile) {
        let toSend = {};
        toSend.userData = profile;
        toSend.labelName =  "shitShit";
        return $http({
            method: "POST",
            url: "/api/gmailAPI/createNewLabel",
            data: toSend
        });
    };

    this.addLabelToEmail = function (profile) {
        let toSend = {};
        toSend.userData = profile;
        toSend.labelData = {
            messageID: "15560d9a0be180c5",
            labelID: "Label_9"
        };
        return $http({
            method: "POST",
            url: "/api/gmailAPI/addLabelToEmail",
            data: toSend
        });
    }

}

