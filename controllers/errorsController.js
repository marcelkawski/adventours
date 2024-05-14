const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid "${err.path}": "${err.value}"`;
    return new AppError(message, 400); // bad request
};

const handleDuplicateFieldsDB = err => {
    const value = err.keyValue.name;
    const message = `Duplicate field value: "${value}"`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
    const errorsMsgs = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errorsMsgs.join(' ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    } else {
        // RENDERED WEBSITE
        console.error('ERROR 💥', err); // Without it we could not see the error.
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong 😞',
            msg: err.message,
        });
    }
};

const sendErrorProd = (err, req, res) => {
    // API
    if (req.originalUrl.startsWith('/api')) {
        // operational, trusted error
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        } else {
            // programming or other unknown error: Don't leak error details.
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong 😞',
            });
        }
    } else {
        // RENDERED WEBSITE
        // operational, trusted error
        if (err.isOperational) {
            res.status(err.statusCode).render('error', {
                title: 'Something went wrong 😞',
                msg: err.message,
            });
        } else {
            // programming or other unknown error: Don't leak error details.
            console.error('ERROR 💥', err);
            res.status(err.statusCode).render('error', {
                title: 'Something went wrong 😞',
                msg: 'Please try again later.',
            });
        }
    }
};

module.exports = (err, req, res, next) => {
    console.log(err.stack); // stack trace: call stack of error

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const env = process.env.NODE_ENV;

    if (env === 'development') {
        sendErrorDev(err, req, res);
    } else if (env === 'production') {
        let error = { ...err };
        error.message = err.message; // We had to add this because without it in prod the error message was not copied.

        if (err.name === 'CastError')
            error = handleCastErrorDB(error); // invalid ID (or other fields)
        else if (err.code === 11000)
            error = handleDuplicateFieldsDB(error); // duplicate fields values
        else if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        else if (err.name === 'JsonWebTokenError') error = handleJWTError();
        else if (err.name === 'TokenExpiredError')
            error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};
