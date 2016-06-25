"use strict";

const express = require("express");
const router = express.Router();
const User = require('../models/user');

router.get("/", (req, res) => {
  User.find({}, (err, users) => {
      res.status(err ? 400 : 200).send(err || users);
    });
});

router.get("/:id", (req, res) => {
  User.findbyId({}, (err, user) => {
      res.status(err ? 400 : 200).send(err || user);
    }).populate('applications');
});

module.exports = router;
