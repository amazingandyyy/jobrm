"use strict";

const request = require('request');
const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {

  var options = {
    url: 'http://api.glassdoor.com/api/api.htm',
    qs: {
      v: '1',
      format: 'json',
      't.p': process.env.GLOSSDOOR_PARTNER_ID,
      't.k': process.env.GLOSSDOOR_KEY,
      action: 'employers',
      q: 'IT',
      userip: '192.168.43.42',
      useragent: 'Mozilla/%2F4.0'
    }
  };

  request(options, (err, response, body) => {
    res.status(err ? 400 : 200).send(err || body);
  });
});

module.exports = router;
