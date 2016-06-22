"use strict";

angular
    .module("jobrmApp")
    .service("Milestone", function($http, store){
        this.createOneMilestone = (milestoneData, applicantId) => {
            console.log('applicantIdddddd: ',applicantId);
            var newMilestone = {
                milestoneData: milestoneData,
                applicantId: applicantId
            };
            console.log('applicationData: ', newMilestone);

           return $http({
                method: 'POST',
                url: `/api/applications/create`,
                data: newApplicationRequest
            });
        }
    });
