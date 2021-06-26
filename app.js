var express = require('express');
var logger = require('morgan');
const args = require('args-parser')(process.argv);

var indexRouter = require('./routes/index');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
module.exports = app;
