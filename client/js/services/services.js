"use strict";

angular
    .module("jobrmApp")
    .service("Application", ($http) => {
        this.getAllApplications = () => {
            return $http({
                method: 'GET',
                url: `/api/applications/all`
            });
        }
        // this.getOneApplication = (applicationId) => {
        //     return $http({
        //         method: 'GET',
        //         url: `/api/applications/${applicationId}`
        //     });
        // }
        // this.createOneApplication = (applicationData) => {
        //     return $http({
        //         method: 'POST',
        //         url: `/api/applications/`,
        //         data: {
        //             applicationData: applicationData
        //         }
        //     });
        // }
    })
