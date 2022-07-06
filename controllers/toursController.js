const Tour = require('./../models/toursModel');

// route handlers

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.getTourById = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
    const id = req.params.id * 1;
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: 'Invalid data sent.',
        });
    }
};

exports.updateTourById = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // to get the updated tour
                runValidators: true,
            }
        );

        res.status(200).json({
            message: 'success',
            data: {
                tour: updatedTour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};

exports.deleteTourById = (req, res) => {
    // const id = req.params.id * 1;
    // const updatedTours = tours.filter(t => t.id !== id);

    // fs.writeFile(dataFilePath, JSON.stringify(updatedTours), err => {
    //     res.status(204).json({
    //         status: 'success',
    //         data: null,
    //     });
    // });
    res.status(204).json({
        status: 'success',
        data: null,
    });
};
