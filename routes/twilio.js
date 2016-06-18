"use strict";

let express = require("express");
let router = express.Router();
let twilio = require('twilio');

router.post("/", (req, res) => {

   const TWILIO_ACCOUNTSID = process.env.TWILIO_ACCOUNTSID;
   const TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;
   const TWILIO_FROM = process.env.TWILIO_FROM;

   let client = require('twilio')(TWILIO_ACCOUNTSID, TWILIO_AUTHTOKEN);
   let twilioto = req.body.twilioto;
   let twiliobody = req.body.twiliobody;

   client.messages.create({
       to: twilioto,
       from: TWILIO_FROM,
       body: twiliobody
   },  (err, message) => {
      res.status(err ? 400 : 200).send(err);
   });
});

module.exports = router;
