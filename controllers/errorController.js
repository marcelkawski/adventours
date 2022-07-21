const AppError = require('./../utils/appError');

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

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
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
};

module.exports = (err, req, res, next) => {
    console.log(err.stack); // stack trace: call stack of error

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    const env = process.env.NODE_ENV;

    if (env === 'development') {
        sendErrorDev(err, res);
    } else if (env === 'production') {
        let error = { ...err };

        if (err.name === 'CastError')
            error = handleCastErrorDB(error); // invalid ID (or other fields)
        else if (err.code === 11000)
            error = handleDuplicateFieldsDB(error); // duplicate fields values
        else if (err.name === 'ValidationError')
            error = handleValidationErrorDB(error);

        sendErrorProd(error, res);
    }
};
