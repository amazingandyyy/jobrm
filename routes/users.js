'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', (req, res) => {
    User.saveGmailUser(req.body, (err, token, savedUser) => {
        if(err) {
            res.status(400).send(err);
        } else {
            res.cookie('accessToken', token).send(savedUser);
        }
    });
});

router.put('/:id', User.isLoggedIn, (req, res) => {
    User.edit(req.params.id, req.body, (err, editedUser) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(editedUser);
        }
    });
});

router.get('/:id', User.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, user) => {
        res.status(err ? 400 : 200).send(err || user)
    }).populate('applications');;
});

router.get('/', User.isLoggedIn, (req, res) => {
    User.find({}, (err, users) => {
        res.status(err ? 400 : 200).send(err || users);
    })
});

router.delete('/:id', User.isLoggedIn, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if (err) return res.status(400).send(err);
        res.send();
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken').send();
});

module.exports = router;
