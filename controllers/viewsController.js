const Tour = require('./../models/toursModel');
const Review = require('./../models/reviewsModel');
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

exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate({
        path: 'reviews',
        fields: 'review rating author',
    });
    const reviews = await Review.find({ tour: tour._id });

    res.status(200).render('tour', {
        tour,
        reviews,
    });
});
