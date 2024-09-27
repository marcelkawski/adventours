const dotenv = require('dotenv');
const mongoose = require('mongoose');

// uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`UNCAUGHT EXCEPTION 💥 Shutting down...`);
    console.log(`${err.name}: ${err.message}`);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    // local db
    // .connect(process.env.DATABASE_LOCAL, {
    // hosted db
    .connect(db, {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false, // I had to comment this because there was an error from Mongoose (https://stackoverflow.com/questions/68958221/mongoparseerror-options-usecreateindex-usefindandmodify-are-not-supported)
        useUnifiedTopology: true, // from warning from MongoDB displaying when starting the db
    })
    .then(() => {
        console.log('Database connection successful!');
    });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// unhandled rejections
process.on('unhandledRejection', err => {
    console.log(`UNHANDLED REJECTION 💥 Shutting down...`);
    console.log(`${err.name}: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});

// Responding to a SIGTERM Signal event when using Heroku - Heroku restarts dynos (containers on which app runs) every 24 hours. To avoid shutting down when some request is handled we need to react to it properly.
// process.on('SIGTERM', () => {
//     console.log(`SIGTERM received. Shutting down gracefully...`);
//     server.close(() => {
//         console.log('💥 Process terminated!');
//     });
// });
