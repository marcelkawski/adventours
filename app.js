const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorsController');

const app = express();

// GLOBAL MIDDLEWARE

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000, // 1000 requests per hour from one IP
    message: 'Too many requests from this IP! Please try again in an hour.',
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
    next(
        new AppError(`Could not find ${req.originalUrl} on this server :(`),
        404
    );
});

app.use(globalErrorHandler);

module.exports = app;
