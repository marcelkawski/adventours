const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Tour = require('./../models/toursModel');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true, // from warning from MongoDB displaying when starting the db
    })
    .then(() => {
        console.log('Database connection successful.');
    });

// read json file
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8')
);

// import data into the database
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully imported into the database!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// delete all data from database
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted from the database.');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
