"use strict";

angular
    .module("jobrmApp")
    .service("Application", function($http, store){
        var user = store.get('currentUser');
        this.getOneApplication = (applicationId) => {
            return $http({
                method: 'GET',
                url: `/api/applications/${applicationId}`
            });
        }
        this.createOneApplication = (applicationData, applicantId) => {
            var newApplicationRequest = {
                applicationData: applicationData,
                applicantId: applicantId
            }
            console.log('applicationData: ', applicationData);

            return $http({
                method: 'POST',
                url: `/api/applications/create`,
                data: newApplicationRequest
            });
        }
    });
