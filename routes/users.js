'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');


router.post('/', (req, res) => {
    User.saveGmailUser(req.body, (err, savedUser) => {
        res.status(err ? 400: 200).send(err || savedUser);
    });
});


router.get('/profile',  (req, res) => {
    res.send(req.user);
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

router.get('/',  (req, res) => {
    User.find({}, (err, users) => {
        res.status(err ? 400 : 200).send(err || users);
    })
});

router.get('/:id', (req, res) => {
    User.find(req.params.id, (err, user) => {
        if (err) return res.status(400).send(err)

        res.send(user)
    }).select('-password');
});

router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if(err) return res.status(400).send(err);

        res.send();
    });
});

module.exports = router;
