const fs = require('fs');

const dataFilePath = `${__dirname}/../data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(dataFilePath));

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours,
        },
    });
};

exports.getTourById = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.updateTourById = (req, res) => {
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

exports.deleteTourById = (req, res) => {
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
