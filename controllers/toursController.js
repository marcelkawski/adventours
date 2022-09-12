const Tour = require('./../models/toursModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

// middleware - alias: /top-5-cheapest
exports.aliasTop5Cheapest = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

// route handlers
exports.getTourById = factory.getOneById(Tour, { path: 'reviews' });
exports.getAllTours = factory.getAll(Tour);
exports.createTour = factory.createOne(Tour);
exports.updateTourById = factory.updateOneById(Tour);
exports.deleteTourById = factory.deleteOneById(Tour);

exports.getStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        // {
        //     $match: { ratingsAverage: { $gte: 4.5 } },
        // },
        {
            $group: {
                // _id: null, // stats for all the tours
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 }, // 1 - ascending
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } },
        // },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    // get number of tours in each month of the year
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            // seperate to make all tours have only one date
            $unwind: '$startDates',
        },
        {
            // get only dates chosen year
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            // group them by month
            $group: {
                _id: { $month: '$startDates' },
                numToursStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            // change name of "_id" field
            $addFields: { month: '$_id' },
        },
        {
            // hide "_id" field
            $project: {
                _id: 0,
            },
        },
        {
            // sort descending by number of tours starting this month
            $sort: { numToursStarts: -1 },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            plan,
        },
    });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; // in radians | 3963.2 - radius of Earh in miles

    if (!lat || !lng) {
        next(
            new AppError(
                'Please enter the location around which you are looking for tours in this format: "<latitude>,<longitude>".',
                400
            )
        );
    }

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    });

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            data: tours,
        },
    });
});

exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001; // miles / kilometers

    if (!lat || !lng) {
        next(
            new AppError(
                'Please enter the location from which you are looking for distances from tours\' starting locations in this format: "<latitude>,<longitude>".',
                400
            )
        );
    }

    const distances = await Tour.aggregate([
        {
            $geoNear: {
                // $geoNear - the only geospatial aggregation pipeline stage that exists; Always needs to be first in pipeline. We need field that has geospatial index. It's startLocation in this case.
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1],
                },
                distanceField: 'distance', // how it will be called
                distanceMultiplier: multiplier, // to convert meters into kilometers or miles
            },
        },
        {
            $project: {
                // names of fields to want to keep in output
                distance: 1,
                name: 1,
            },
        },
        {
            $addFields: { distanceUnit: unit },
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            data: distances,
        },
    });
});
