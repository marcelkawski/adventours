const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a name.'],
            unique: true,
            minlength: [10, 'A tour must have at least 10 characters.'],
            maxlength: [40, 'A tour name must have 40 characters or less.'],
        },

        slug: String,

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
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty can be either: easy, medium, difficult.',
            },
        },

        ratingsAverage: {
            type: Number,
            default: 1.0,
            min: [1, 'Rating must be greater than or equal to 1.0.'],
            max: [5, 'Rating must be less than or equal to 5.0.'],
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

        secret: {
            type: Boolean,
            default: false,
        },
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

// document middleware: Runs before .save() and .create(), but not insertMany()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// query middleware
tourSchema.pre(/^find/, function (next) {
    // all methods starting with "find"
    this.find({ secret: { $ne: true } }); // Because some tours don't have a "secret" attribute.
    this.start = Date.now();
    next();
});

tourSchema.post(/^find/, function (documents, next) {
    console.log(`Query took: ${Date.now() - this.start} milliseconds.`);
    next();
});

// aggregation middleware
// filter secret tours during aggregation (for getting tours stats)
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { secret: { $ne: true } } }); // add alement at the beginning of the aggregation pipeline
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
