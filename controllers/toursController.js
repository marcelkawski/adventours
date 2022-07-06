const Tour = require('./../models/toursModel');

// const dataFilePath = `${__dirname}/../data/tours-simple.json`;
// const tours = JSON.parse(fs.readFileSync(dataFilePath));

// exports.checkID = (req, res, next, val) => {
//     console.log(val);
//     const id = req.params.id * 1;
//     const tour = tours.find(t => t.id === id);
//     if (!tour) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid tour ID',
//         });
//     }
//     next();
// };

// exports.checkCrTourBody = (req, res, next) => {
//     const body = req.body;
//     if ('name' in body && 'price' in body) next();
//     else {
//         res.status(400).json({
//             status: 'fail',
//             message:
//                 'Bad request - "name" or/and "price" are missing. They are required to create a new tour.',
//         });
//     }
// };

// route handlers

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        // results: tours.length,
        // data: {
        //     tours,
        // },
    });
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

exports.createTour = (req, res) => {
    const newTour = new Tour({});
    newTour.save();

    Tour.create({});
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
    // tours.push(newTour);

    // fs.writeFile(dataFilePath, JSON.stringify(tours), err => {
    //     res.status(201).json({
    //         status: 'success',
    //         data: {
    //             tour: newTour,
    //         },
    //     });
    // });
    res.status(201).json({
        status: 'success',
        // data: {
        //     tour: newTour,
        // },
    });
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
