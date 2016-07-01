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
            console.log('applicantIdddddd: ',applicantId);
            var newApplicationRequest = {
                applicationData: applicationData,
                applicantId: applicantId
            };
            console.log('applicationData: ', applicationData);


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
            console.log("THat google Access: ", googleAccess)
            return $http({
                method: 'POST',
                url: `/api/applications/${applicantId}/delete/${applicationId}`,
                data: {googleAccess: {access_token: googleAccess.identities[0].access_token}}
            })
        }
    });
