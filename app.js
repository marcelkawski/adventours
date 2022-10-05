const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');

const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewsRouter = require('./routes/reviewsRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorsController');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // path to views folder

// GLOBAL MIDDLEWARE
// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers.
app.use(helmet());

// developmnet logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same IP.
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000, // 1000 requests per hour from one IP
    message: 'Too many requests from this IP! Please try again in an hour.',
});
app.use('/api', limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// Prevent parameter pollution.
app.use(
    hpp({
        whitelist: [
            // except those fields - Because we could want to get tours with duration 5 or 9
            'duration',
            'ratingsAverage',
            'ratingsQuantity',
            'maxGroupSize',
            'difficulty',
            'price',
        ],
    })
);

// Test middleware.
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
    });
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

app.all('*', (req, res, next) => {
    next(
        new AppError(`Could not find ${req.originalUrl} on this server :(`),
        404
    );
});

app.use(globalErrorHandler);

module.exports = app;
