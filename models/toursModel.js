const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a name.'],
        unique: true,
    },

    duration: {
        type: Number,
        required: [true, 'A tour must have duration.'],
    },

    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a maximum group size.'],
    },

    difficulty: {
        type: String,
        required: [true, 'A tour must have difficulty.'],
    },

    ratingsAverage: {
        type: Number,
        default: 0.0,
    },

    ratingsQuantity: {
        type: Number,
        default: 0,
    },

    price: {
        type: Number,
        required: [true, 'A tour must have a price.'],
    },

    priceDiscount: Number,

    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary.'],
    },

    description: {
        type: String,
        trim: true,
    },

    imageCover: {
        type: String, // simply the name of the image
        required: [true, 'A tour must have a cover image.'],
    },

    images: [String],

    createdAt: {
        type: Date,
        default: Date.now(),
    },

    startDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
