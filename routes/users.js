'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/', (req, res) => {
    User.saveGmailUser(req.body, (err, savedUser) => {
        res.status(err ? 400: 200).send(err || savedUser);
    });
});

router.put('/:id',  (req, res) => {
    User.edit(req.params.id, req.body, (err, editedUser) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.send(editedUser);
        }
    });
});

router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return res.status(400).send(err)

        res.send(user)
    });
});

router.get('/',  (req, res) => {
    User.find({}, (err, users) => {
        res.status(err ? 400 : 200).send(err || users);
    })
});

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if(err) return res.status(400).send(err);

        res.send();
    });
});

module.exports = router;
