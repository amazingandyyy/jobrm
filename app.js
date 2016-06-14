"use strict";

const PORT = process.env.PORT || 3000;

var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var path = require("path");
var pathToStatic = path.join(__dirname, "public");

var mongoose = require("mongoose");
const MONGOURL = process.env.MONGODB_URI || `mongodb://localhost/testDatabase`;

mongoose.connect(MONGOURL, function (error) {
    console.log(error || `Connected to MongoDB at ${MONGOURL}`);
});

var app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.static(pathToStatic));

app.use("/", require("./routes/index"));
app.use("/api", require("./routes/api"));

app.listen(PORT, function (error) {
    console.log(error || `Server listening on port ${PORT}`);
});

module.exports = app;
