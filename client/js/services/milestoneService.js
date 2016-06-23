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
        };
        this.getOneMilestone = (id) => {
            return $http({
                method: 'GET',
                url: `/api/milestones/${id}`
            });
        };
        this.updateMilestone = (milestoneData, milestoneId) => {
            return $http({
                method: 'PUT',
                url: `/api/milestones/${milestoneId}`,
                data: milestoneData
            });
        };
        this.deleteMilestone = (applicationId, milestoneId) => {
            return $http({
                method: 'DELETE',
                url: `/api/milestones/${applicationId}/delete/${milestoneId}`
            });
        };
    });