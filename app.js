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
    const id = req.params.id * 1; // to convert string to a number
    const tour = tours.find((el) => el.id === id);
    if (tour) {
        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } else {
        res.status(404).json({
            // We had return before "res.status" in the course code to finish the function here. The teacher had it before successful case so that's why he had return here but I do not need it. Moreover, we just have "if" and "else" blocks.
            status: 'fail',
            message: 'Invalid tour ID',
        });
    }
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

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
