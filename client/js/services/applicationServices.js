"use strict";

angular
    .module("jobrmApp")
    .service("Application", function($http, store){
        this.getOneApplication = (id) => {
            return $http({
                method: 'GET',
                url: `/api/applications/${id}`
            });
        };
        this.createOneApplication = (applicationData, applicantId, googleAccess) => {
            var newApplicationRequest = {
                applicationData: applicationData,
                applicantId: applicantId
            };

           return $http({
                method: 'POST',
                url: `/api/applications/create`,
                data: newApplicationRequest
            });
        };
        this.updateApplication = (updateData, applicationId) => {
            return $http({
                method: 'PUT',
                url: `/api/applications/${applicationId}`,
                data: updateData
            })
        };
        this.deleteApplication  = (applicationId, applicantId, googleAccess) => {
            return $http({
                method: 'POST',
                url: `/api/applications/${applicantId}/delete/${applicationId}`,
                data: {googleAccess: {access_token: googleAccess.identities[0].access_token}}
            })
        }
    });
