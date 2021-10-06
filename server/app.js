const express = require('express');
const app = express();

const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

// socket.io

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.resolve(__dirname, '../dist')));

// Development logging
if (process.env.NODE_ENV === 'developement') {
  app.use(morgan('dev'));
}

// Body parser; reading data from the body into req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// ROUTES
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// Handle 404
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
