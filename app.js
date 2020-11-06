"use strict";

var http = require('http');
http.globalAgent.maxSockets = Infinity;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');
var routes = require('./routes');
var models = require('./models');

var app = express();

// var wwwhisper = require('connect-wwwhisper');
// app holds a reference to express or connect framework, it
// may be named differently in your source file.
// app.use(wwwhisper());

// Alternatively, if you don't want wwwhisper to insert
// a logout iframe into HTML responses use.
// app.use(wwwhisper(false));

app.use(bodyParser.json({
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(express.static(path.join(__dirname, 'public')));
//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://caspar-stock.herokuapp.com");
    res.header("Access-Control-Allow-Origin", "https://caspar-stock.herokuapp.com");
    res.header("Access-Control-Allow-Origin", "http://localhost:8094");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,");
    next();
});

app.use('', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var errorJson = {
        message: err.message
    };
    var header = err.header;
    if (header) {
        var key = Object.keys(header)[0];
        res.setHeader(key, header[key]);
        delete err.header;
    }
    res.send(JSON.stringify(errorJson));
});


module.exports = app;