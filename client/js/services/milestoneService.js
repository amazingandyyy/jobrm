"use strict";

angular
    .module("jobrmApp")
    .service("Milestone", function($http, store){
        this.createOneMilestone = (milestoneData, applicationId) => {
            var newMilestone = {
                milestoneData: milestoneData,
                applicationId: applicationId
            };
            console.log('applicationData: ', newMilestone);

           return $http({
                method: 'POST',
                url: `/api/milestones`,
                data: newMilestone
            });
        }
    });
