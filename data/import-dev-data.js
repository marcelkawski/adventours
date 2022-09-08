const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Tour = require('./../models/toursModel');
const User = require('./../models/usersModel');
const Review = require('./../models/reviewsModel');

dotenv.config({ path: './config.env' });

const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(db, {
        // useNewUrlParser: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        useUnifiedTopology: true, // from warning from MongoDB displaying when starting the db
    })
    .then(() => {
        console.log('Database connection successful.');
    });

// read json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf8'));
const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/reviews.json`, 'utf8')
);

// import data into the database
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false }); // We need to turn off validation because we create users without passwordConfirm property (it is not in users.json file). We also had to comment lines with password encryption in users model.
        await Review.create(reviews);

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
        await User.deleteMany();
        await Review.deleteMany();

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
