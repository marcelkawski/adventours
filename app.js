const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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

const dataFilePath = `${__dirname}/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(dataFilePath));

// ROUTE HANDLERS

const getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
};

const getTourById = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((t) => t.id === id);
    if (tour) {
        return res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    }

    res.status(404).json({
        status: 'fail',
        message: 'Invalid tour ID',
    });
};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(dataFilePath, JSON.stringify(tours), (err) => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    });
};

const updateTourById = (req, res) => {
    const id = req.params.id * 1;
    let tour = tours.find((t) => t.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid tour ID',
        });
    }

    const updatedTour = Object.assign(tour, req.body);
    const updatedTours = tours.map((t) =>
        t.id === updatedTour.id ? updatedTour : t
    );

    fs.writeFile(dataFilePath, JSON.stringify(updatedTours), (err) => {
        res.status(200).json({
            status: 'success',
            data: {
                updatedTour,
            },
        });
    });
};

const deleteTourById = (req, res) => {
    const id = req.params.id * 1;
    let tour = tours.find((t) => t.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid tour ID',
        });
    }

    const updatedTours = tours.filter((t) => t.id !== id);

    fs.writeFile(dataFilePath, JSON.stringify(updatedTours), (err) => {
        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
};

const getAllUsers = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};

const getUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};

const updateUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};

const deleteUserById = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet implemented.',
    });
};

// ROUTES

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app.route('/api/v1/tours/:id')
    .get(getTourById)
    .patch(updateTourById)
    .delete(deleteTourById);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app.route('/api/v1/users/:id')
    .get(getUserById)
    .patch(updateUserById)
    .delete(deleteUserById);

// SERVER

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
