"use strict";

angular
    .module("jobrmApp")
    .service("Application", function($http, store){
        var user = store.get('currentUser');
        this.getAllApplications = () => {
            var id  = user._id;
            return $http({
                method: 'GET',
                url: `/api/applications/all/${id}`
            });
        }
        this.getOneApplication = (applicationId) => {
            return $http({
                method: 'GET',
                url: `/api/applications/${applicationId}`
            });
        }
        this.createOneApplication = (applicationData) => {
            var id  = user._id;
            applicationData.applicant = id;
            console.log('applicationData: ', applicationData);
            return $http({
                method: 'POST',
                url: `/api/applications/${id}`,
                data: applicationData
            });
        }
    });
