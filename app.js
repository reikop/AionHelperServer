var express = require('express');
// var logger = require('morgan');

var indexRouter = require('./routes/index');
var app = express();

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
    const corsWhitelist = [
        'https://reikop.github.io',
        'https://reikop.io',
        'http://localhost:8080',
    ];
    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');
    }

    next();
});

app.use('/', indexRouter);
module.exports = app;