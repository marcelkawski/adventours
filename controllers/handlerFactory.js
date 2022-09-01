const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

const getDocModelName = Model => Model.collection.collectionName.slice(0, -1); // e.g. for Tour model it returns "tour" (without "s" at the end.)

exports.getOneById = (Model, populateOptions) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOptions) query = query.populate(populateOptions); // populate from virtual populate (therefore unusually here, not in middleware)
        const doc = await query;

        if (!doc) {
            return next(
                new AppError(
                    `No ${getDocModelName(Model)} found with that id :(`,
                    404
                )
            );
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: doc,
            },
        });
    });

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        // to enable getting reviews for specific tour
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };

        //build query
        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // execute query
        const docs = await features.query;

        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: {
                data: docs,
            },
        });
    });

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const newDoc = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: newDoc,
            },
        });
    });

exports.updateOneById = Model =>
    catchAsync(async (req, res, next) => {
        const updatedDoc = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // to get the updated document
                runValidators: true, // to check the validators before updating (e.g. min length)
            }
        );

        if (!updatedDoc) {
            return next(
                new AppError(
                    `No ${getDocModelName(Model)} found with that id :(`,
                    404
                )
            );
        }

        res.status(200).json({
            status: 'success',
            data: {
                data: updatedDoc,
            },
        });
    });

exports.deleteOneById = Model =>
    catchAsync(async (req, res, next) => {
        const deletedDoc = await Model.findByIdAndDelete(req.params.id);

        if (!deletedDoc) {
            return next(
                new AppError(
                    `No ${getDocModelName(Model)} found with that id :(`,
                    404
                )
            );
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
