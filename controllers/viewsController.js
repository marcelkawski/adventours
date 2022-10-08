const Tour = require('./../models/toursModel');
const Review = require('./../models/reviewsModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
    const tours = await Tour.find();

    res.status(200).render('overview', {
        title: 'All tours',
        tours,
    });
});

exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating author',
    });

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour,
    });
});
