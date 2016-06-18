"use strict";

const requestNPM = require("request");
const Batchelor = require("batchelor");

const gmailAPIOperations = {

    getEmails: function (userData, callback) {
        let options = {
            url: `https://www.googleapis.com/gmail/v1/users/${userData.profile.email}/messages?maxResults=20&key=AIzaSyAW4CgLvkN49dw_BrzhIOq4xnM3ueKOMfY`,
            headers: {
                Authorization: `Bearer ${userData.accessToken}`
            }
        };
        requestNPM(options, function (error, responseObjectsList, bodyList) {
            let parsedMessages = JSON.parse(bodyList).messages;
            let batch = new Batchelor({
                'uri':'https://www.googleapis.com/batch',
                'method':'POST',
                'auth': {
                    'bearer': userData.accessToken
                },
                'headers': {
                    'Content-Type': 'multipart/mixed'
                }
            });
            if(parsedMessages){
                parsedMessages.forEach(function (value, key) {
                    let messageId = value.id;
                    batch.add({
                        "method": "GET",
                        "path": `/gmail/v1/users/${userData.profile.email}/messages/${messageId}/?key=AIzaSyAW4CgLvkN49dw_BrzhIOq4xnM3ueKOMfY`
                    })
                });
            }
            batch.run(function (error, response) {
                callback(error, response.parts);
            });
        });
    }



};

module.exports = gmailAPIOperations;
