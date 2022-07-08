const Tour = require('./../models/toursModel');

// route handlers

exports.getAllTours = async (req, res) => {
    try {
        // build query
        const queryObj = { ...req.query };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            match => `$${match}`
        ); // to make filter objects contain "$" before the operators

        let query = Tour.find(JSON.parse(queryStr));

        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' '); // to replace commas in URLs with spaces
            query = query.sort(sortBy);
        } else {
            // default sorting
            query = query.sort('-createdAt _id');
            /* If using the $skip stage with any of sort be sure to include at least one field in your sort that contains unique values, before passing results to the $skip stage.*/
        }

        // fields limiting - Limiting must be either inclusive or exclusive.
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            if (fields[0] === '-') query = query.select(`${fields} -__v`);
            else query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        // execute query
        const tours = await query;

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
            status: 'success',
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

exports.deleteTourById = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err,
        });
    }
};
