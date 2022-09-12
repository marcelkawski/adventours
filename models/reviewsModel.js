const mongoose = require('mongoose');

const Tour = require('./toursModel');

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

reviewSchema.index({ tour: 1, author: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: 'name',
    });
    next();
});

reviewSchema.statics.calcAvgRating = async function (tourId) {
    // This is static method because we need to call aggregate on model, not on instance.
    // this - current model
    const stats = await this.aggregate([
        {
            $match: { tour: tourId },
        },
        {
            $group: {
                _id: '$tour',
                nRatings: { $sum: 1 },
                avgRating: { $avg: '$rating' },
            },
        },
    ]);

    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRatings,
            ratingsAverage: stats[0].avgRating,
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
        });
    }
};

// updating ratingsAverage and ratingsQuantity when ADDING review
reviewSchema.post('save', function () {
    this.constructor.calcAvgRating(this.tour); // this.constructor = Review (but it's not available yet in this part of code. It's defined below.)
});

// updating ratingsAverage and ratingsQuantity when UPDATING or DELETING review
// for:
// findByIdAndUpdate - shorthand for findOneAndUpdate (That's why we have "/^findOneAnd/")
// findByIdAndDelete - ---||---
reviewSchema.post(/^findOneAnd/, async review => {
    if (review) await review.constructor.calcAvgRating(review.tour);
});

// to set ratingsAverage of tour of deleted review as null when it does not have any reviews anymore
reviewSchema.post('findOneAndDelete', async review => {
    const tour = await Tour.findById(review.tour);
    if (tour.ratingsQuantity === 0) {
        tour.ratingsAverage = null;
        await tour.save();
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
