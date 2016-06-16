"use strict";
//amazing andy2!!
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    github: {
        type: String
    },
    google: {
        type: String
    },
    biography: {
        type: String
    },
    linksToProfiles: [{
        type: String
    }],
    name: {
        type: String
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
    }],
    emailIndexList: {}
});

userSchema.statics.auth = roleRequired => {
    return (req, res, next) => {
        var token = req.cookies.accessToken;

        jwt.verify(token, JWT_SECRET, (err, payload) => {
            if (err) return res.status(401).send({
                error: 'Authentication required.'
            });

            User.findById(payload._id, (err, user) => {
                if (err || !user) return res.status(401).send({
                    error: 'User not found.'
                });
                req.user = user;

                if (roleRequired === 'admin' && !req.user.admin) {
                    // they don't have admin privilages
                    return res.status(403).send({
                        error: 'Not authorized.'
                    });
                }

                next(); // they have the required privilages
            }).select('-password');
        });
    };
};

userSchema.statics.isLoggedIn = (req, res, next) => {
    var token = req.cookies.accessToken;

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).send({
            error: 'Authentication required'
        });

        User.findById(payload._id, (err, user) => {
            if (err || !user) return res.status(401).send({
                error: 'User not found'
            });
            req.user = user;

            next();
        }).select('-password');
    });

};

userSchema.statics.register = function(userObject, callback) {
    User.findOne({
        email: userObject.email
    }, function(error, userData) {
        if (error || userData) return callback(error || {
            error: "Email Not Available"
        });

        bcrypt.hash(userObject.password, 12, function(error, hash) {
            if (error) return callback(error);

            var user = new User({
                email: userObject.email,
                password: hash
            });

            user.save(callback);
        });
    });
};

userSchema.methods.generateToken = function() {
    console.log('working!!!!!!');
    var token = jwt.sign({
        _id: this._id
    }, JWT_SECRET);

    return token;
};

userSchema.statics.isLoggedIn = function(request, response, next) {

    if (!request.header("Authorization")) {
        return response.status(401).send({
            message: "PLease make sure request has an Authorization Header"
        });
    }

    var token = request.header("Authorization").split(" ")[1];

    jwt.verify(token, JWT_SECRET, function(error, payload) {
        if (error) return response.status(401).send({
            error: "Must be authenticated"
        });

        User.findById(payload._id, function(error, userData) {
            if (error || !userData) return response.clearCookie("accessToken").status(400).send(error || {
                error: "User not found"
            });
            request.user = userData;
            next();
        }).select({
            password: false
        })
    })

};

userSchema.statics.authenticate = function(loginData, callback) {
    console.log('routing');
    User.findOne({
        email: loginData.email
    }, function(error, userData) {
        if (error || !userData) return callback(error || {
            error: "Login Failed. Email or Password is Incorrect"
        });

        bcrypt.compare(loginData.password, userData.password, function(error, isGood) {
            if (error || !isGood) return callback(error || {
                error: "Login Failed. Email or Password Incorrect"
            });
            console.log('what the fuck:');
            var token = userData.generateToken();
            console.log('token:', token)

            callback(null, token);
        });
    });
};

userSchema.statics.addApplication = (user, application, cb) => {
    console.log('working');
    User.findById(user._id, (err, dbUser) => {
        if(dbUser.applications.indexOf(application._id) < 0){
            dbUser.applications.push(application._id);
        }

        dbUser.save((err, savedUser) => {
            if(err) cb(err);

            cb(null, savedUser);
        });
    });
};

userSchema.statics.edit = (id, passedObj, cb) => {
    User.findByIdAndUpdate(id, {
        $set: passedObj
    }, (err, updatedUser) => {
        if (err) cb(err);

        updatedUser.save((err, savedUser) => {
            if (err) cb(err);
            cb(null, savedUser);
        });
    });
};

var User = mongoose.model("User", userSchema);

module.exports = User;
