'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', (req, res) => {
    User.saveGmailUser(req.body, (err, savedUser) => {
        res.status(err ? 400 : 200).send(err || savedUser);
    });
});

router.put('/:id', (req, res) => {
    User.edit(req.params.id, req.body, (err, editedUser) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(editedUser);
        }
    });
});

router.get('/:userId', (req, res) => {
    console.log('req.params.userId: ', req.params.userId);
    User.findById(req.params.userId, (err, user) => {
        console.log('user: ', user);
        res.status(err ? 400 : 200).send(err || user)
    }).populate('applications');
});

router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        res.status(err ? 400 : 200).send(err || users);
    })
});

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) return res.status(400).send(err);
        res.send();
    });
});

module.exports = router;
