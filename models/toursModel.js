const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
    {
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
            select: false,
        },

        startDates: [Date],
    },
    {
        toJSON: { virtuals: true }, // to make virtuals be part of output each time data is outputted as JSON
        toObject: { virtuals: true }, // when data gets outputted as an object
    }
);

// duration of tour in weeks
tourSchema.virtual('durationWeeks').get(function () {
    // We use function because arrow function does not get its own "this keyword".
    return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
