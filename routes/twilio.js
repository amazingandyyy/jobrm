"use strict";

var express = require("express");
var router = express.Router();
var twilio = require('twilio');

var CronJob = require('cron').CronJob;

router.post("/", (req, res) => {

   const TWILIO_ACCOUNTSID = process.env.TWILIO_ACCOUNTSID;
   const TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;
   const TWILIO_FROM = process.env.TWILIO_FROM;

   // var client = require('twilio')(TWILIO_ACCOUNTSID, TWILIO_AUTHTOKEN);
   // var twilioto = req.body.twilioto;
   // var twiliobody = req.body.twiliobody;

   // client.messages.create({
   //     to: twilioto,
   //     from: TWILIO_FROM,
   //     body: twiliobody
   // },  (err, message) => {
      // res.status(err ? 400 : 200).send(err);
   // });

   // new CronJob('* * * * * *', function() {
   /*
      Runs everyday 11:30: AM Monday through Sunday
   */
   new CronJob('00 30 11 * * 0-6', function() {
      console.log('You will see this message every second', Date());
   }, true, true, 'America/Los_Angeles');

   res.status(200).send(Date())

});

module.exports = router;
