const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const getModelName = Model => Model.collection.collectionName.slice(0, -1); // e.g. for Tour model it returns "tour" (without "s" at the end.)

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
                    `No ${getModelName(Model)} found with that id :(`,
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
                    `No ${getModelName(Model)} found with that id :(`,
                    404
                )
            );
        }

        res.status(204).json({
            status: 'success',
            data: null,
        });
    });
