const Tour = require('./../models/toursModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
    // 1. Get tours data.
    const tours = await Tour.find();

    // 2. Build template.
    // 3. Render template using data from point 1.
    res.status(200).render('overview', {
        title: 'All tours',
        tours,
    });
});

exports.getTour = catchAsync((req, res) => {
    res.status(200).render('tour', {
        title: 'The Forest Hiker Tour',
    });
});
