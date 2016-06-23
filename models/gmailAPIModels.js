"use strict";

const requestNPM = require("request");
const Batchelor = require("batchelor");

const gmailAPIOperations = {

    getEmails: function (userData, callback) {
        let options = {
            url: `https://www.googleapis.com/gmail/v1/users/${userData.profile.email}/messages?maxResults=20&key=${process.env.GoogleKEY}`,
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
                        "path": `/gmail/v1/users/${userData.profile.email}/messages/${messageId}/?key=${process.env.GoogleKEY}`
                    })
                });
            }
            batch.run(function (error, response) {
                callback(error, response.parts);
            });
        });
    },
    
    createNewLabel: function (requestData, callback) {
        let userData = requestData.userData;
        let accessToken = userData.identities[0].access_token;
        let requestBody = {
            "labelListVisibility": "labelShow",
            "messageListVisibility": "show",
            "name": requestData.labelName
        };
        let options = {
            url: `https://www.googleapis.com/gmail/v1/users/${userData.email}/labels?key=AIzaSyAW4CgLvkN49dw_BrzhIOq4xnM3ueKOMfY`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            body: requestBody
        };
        requestNPM(options, function (error, httpResponse, body) {
            console.log("body after POST: ", body);
            callback(error, body);
        })

    },

    addLabelToEmail: function (requestData, callback) {
        let userData = requestData.userData;
        let labelData = requestData.labelData;
        let accessToken = userData.identities[0].access_token;
        let requestBody = {
            "addLabelIds": [
                labelData.labelID
            ]
        };
        let options = {
            url: `https://www.googleapis.com/gmail/v1/users/${userData.email}/messages/${labelData.messageID}/modify?key=AIzaSyAW4CgLvkN49dw_BrzhIOq4xnM3ueKOMfY`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            json: true,
            body: requestBody
        };
        requestNPM(options, function (error, httpResponse, body) {
            console.log("Error after POST: ", error);
            console.log("body after POST: ", body);
            callback(error, body);
        })
    }



};

module.exports = gmailAPIOperations;
