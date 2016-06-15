"use strict";

var express = require("express");
var router = express.Router();
var path = require("path");

var twilio = require('twilio');

router.get("/", (req, res) => {

   var accountSid = 'AC93893ed2f6c9b818b2fdd3a0af9b0dc5';
   var authToken = 'eb204557bd246f0eb3708f3b601364f7';

   var client = new twilio.RestClient(accountSid, authToken);

   //require the Twilio module and create a REST client
   var client = require('twilio')(accountSid, authToken);

   client.messages.create({
       to: '6477679977',
       from: '+15005550006',
       body: 'SMS test by Dave Lee to use Twilio API',
   }, function (err, message) {


      console.log("client.messagesclient.messagesclient.messagesclient.messagesclient.messages");

      if(err) {
         console.log(err.message);
      } else if(message) {
         console.log("message.sid");
         console.log(message.sid);
      }
   });

   // response.sendFile(pathToIndex);
});

module.exports = router;
