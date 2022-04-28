const express = require('express');
const morgan = require('morgan');

const toursRouter = require('./routes/toursRoutes');
const usersRouter = require('./routes/usersRoutes');

const app = express();

// MIDDLEWARE

app.use(morgan('dev'));

app.use(express.json()); // middleware to add the body data to the request object ("req") in POST method

app.use((req, res, next) => {
    console.log('Hello from the middleware 👋');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
