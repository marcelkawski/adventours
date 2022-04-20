const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json()); // middleware to add the body data to the request object ("req") in POST method

const dataFilePath = `${__dirname}/data/tours-simple.json`;

const tours = JSON.parse(fs.readFileSync(dataFilePath));

// get all the tours
app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
});

// get the specific tour by id
app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((tour) => tour.id === id);
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
});

// create a new tour
app.post('/api/v1/tours', (req, res) => {
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
});

// update the specific tour by id
app.patch('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    let tour = tours.find((tour) => tour.id === id);

    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid tour ID',
        });
    }

    const updatedTour = Object.assign(tour, req.body);
    const updatedTours = tours.map((tour) =>
        tour.id === updatedTour.id ? updatedTour : tour
    );

    fs.writeFile(dataFilePath, JSON.stringify(updatedTours), (err) => {
        res.status(200).json({
            status: 'success',
            data: {
                updatedTour,
            },
        });
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
