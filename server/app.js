const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use('/auth', authRouter);
app.use('/api', apiRouter);

module.exports = app;
