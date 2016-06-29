"use strict";

angular
    .module("jobrmApp")
    .service("Milestone", function($http, store){
        this.createOneMilestone = (milestoneData, applicationId, googleAccess) => {
            var newMilestone = {
                milestoneData: milestoneData,
                applicationId: applicationId,
                googleAccess: googleAccess
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
        this.addTask = (milestoneId, newTaskObj) => {
            return $http({
                method: 'POST',
                url: `/api/milestones/${milestoneId}`,
                data: newTaskObj
            });
        };
        this.updateTask = (milestoneId, taskId, updateTaskObj) => {
            return $http({
                method: 'PUT',
                url: `/api/milestones/${milestoneId}/update/${taskId}`,
                data: updateTaskObj
            });
        };
        this.deleteTask = (milestoneId, taskId) => {
            return $http({
                method: 'DELETE',
                url: `/api/milestones/${milestoneId}/remove/${taskId}`
            });
        };
    });
