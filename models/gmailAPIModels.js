"use strict";

const requestNPM = require("request");

const gmailAPIOperations = {
    
    getMessagesList: function (userData, callback) {
        let options = {
            url: `https://www.googleapis.com/gmail/v1/users/${userData.profile.email}/messages?key=AIzaSyAW4CgLvkN49dw_BrzhIOq4xnM3ueKOMfY`,
            headers: {
                Authorization: `Bearer ${userData.accessToken}`
            }
        };
        requestNPM(options, function (error, body) {
            callback(error, body);
        });
    }
    
    
};

module.exports = gmailAPIOperations;