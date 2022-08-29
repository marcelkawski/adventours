const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review needs an author.'],
        },

        review: {
            type: String,
            required: [true, 'Review cannot be empty.'],
        },

        rating: {
            type: Number,
            default: 1.0,
            min: [1, 'Rating must be greater than or equal to 1.0.'],
            max: [5, 'Rating must be less than or equal to 5.0.'],
        },

        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'Tour',
            required: [true, 'You can review only specific tour.'],
        },

        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
    },
    {
        toJSON: { virtuals: true }, // to make virtuals be part of output each time data is outputted as JSON
        toObject: { virtuals: true }, // when data gets outputted as an object
    }
);

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
