const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const getModelName = Model => Model.collection.collectionName.slice(0, -1); // e.g. for Tour model it returns "tour" (without "s" at the end.)

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
