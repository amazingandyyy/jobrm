'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');

router.post('/register', (req, res) => {
    User.register(req.body, (err, savedUser) => {
        res.status(err ? 400 : 200).send(err || savedUser);
    });
});

router.post('/authenticate', (req, res) => {
    console.log('working');
    User.authenticate(req.body, (err, token, dbUser) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.cookie('accessToken', token).send();
        }
    });
});

router.get('/profile', User.isLoggedIn, (req, res) => {
    res.send(req.user);
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

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken').send();
});

router.get('/', User.isLoggedIn, (req, res) => {
    User.find({}, (err, users) => {
        res.status(err ? 400 : 200).send(err || users);
    }).select('-password');
});

router.get('/:id', User.isLoggedIn, (req, res) => {
    User.find(req.params.id, (err, user) => {
        if (err) return res.status(400).send(err)

        res.send(user)
    }).select('-password');
});

router.delete('/:id', User.isLoggedIn, (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, user) => {
        if(err) return res.status(400).send(err);

        res.send();
    });
});

module.exports = router;
