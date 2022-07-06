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

exports.getTourById = (req, res) => {
    const id = req.params.id * 1;
    // const tour = tours.find(t => t.id === id);
    // return res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour,
    //     },
    // });
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

exports.updateTourById = (req, res) => {
    // const id = req.params.id * 1;
    // const tour = tours.find(t => t.id === id);

    // const updatedTour = Object.assign(tour, req.body);
    // const updatedTours = tours.map(t =>
    //     t.id === updatedTour.id ? updatedTour : t
    // );

    // fs.writeFile(dataFilePath, JSON.stringify(updatedTours), err => {
    //     res.status(200).json({
    //         status: 'success',
    //         data: {
    //             updatedTour,
    //         },
    //     });
    // });
    res.status(200).json({
        status: 'success',
        // data: {
        //     updatedTour,
        // },
    });
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
