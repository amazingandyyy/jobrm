"use strict";

angular
    .module("jobrmApp")
    .service("Application", function($http){
        this.getAllApplications = () => {
            return $http({
                method: 'GET',
                url: `/api/applications/`
            });
        }
        this.getOneApplication = (applicationId) => {
            return $http({
                method: 'GET',
                url: `/api/applications/${applicationId}`
            });
        }
        this.createOneApplication = (applicationData) => {
            console.log('applicationData: ', applicationData);
            return $http({
                method: 'POST',
                url: `/api/applications/`,
                data: applicationData
            });
        }
    })
    .service("GmailServices", function ($http) {
        this.retrieveInboxList = function (profileInfo) {
            let toSend = {};
            toSend.profile = profileInfo;
            toSend.accessToken = profileInfo.identities[0].access_token;
            return $http.put("/api/gmailAPI/getMessagesList/", toSend);
        };
    });
