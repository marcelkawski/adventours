const mongoose = require('mongoose');
const slugify = require('slugify');

// const User = require('./usersModel'); // for embedding guides into tours

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a name.'],
            unique: true,
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
            default: null,
            min: [1, 'Rating must be greater than or equal to 1.0.'],
            max: [5, 'Rating must be less than or equal to 5.0.'],
            // set: val => Math.round(val * 10) / 10, // This function will be called each time that a new value is set for this field.
        },

        ratingsQuantity: {
            type: Number,
            default: 0,
        },

        price: {
            type: Number,
            required: [true, 'A tour must have a price.'],
        },

        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    // This only points to current document on NEW document creation
                    return val < this.price;
                },
                message:
                    'Discount price ({VALUE}) must be lower than a regular price.',
            },
        },

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

        startLocation: {
            // embedded/denormalized dataset
            // To be recognized as GeoJSON we need to have "type" and "coordinates" properties.
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'], // possible options this field can take
            },
            coordinates: [Number],
            address: String,
            description: String,
        },

        locations: [
            // embedded/denormalized dataset
            {
                type: {
                    type: String,
                    default: 'Point',
                    enum: ['Point'],
                },
                coordinates: [Number],
                address: String,
                description: String,
                day: Number, // day of the tour
            },
        ],

        // guides: Array, // embedding
        guides: [
            // referencing
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: { virtuals: true }, // to make virtuals be part of output each time data is outputted as JSON
        toObject: { virtuals: true }, // when data gets outputted as an object
    }
);

// tourSchema.index({ price: 1 }); // ascending order
tourSchema.index({ price: 1, ratingsAverage: -1 }); // compound index
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' }); // for getToursWithin

// duration of tour in weeks
tourSchema.virtual('durationWeeks').get(function () {
    // We use function because arrow function does not get its own "this keyword".
    return this.duration / 7;
});

// virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id',
});

// document middleware: Runs before .save() and .create(), but not insertMany()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

// embedding guides into tours
// tourSchema.pre('save', async function (next) {
//     const guidesPromises = this.guides.map(async id => await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });

// query middleware
tourSchema.pre(/^find/, function (next) {
    // all methods starting with "find"
    this.find({ secret: { $ne: true } }); // Because some tours don't have a "secret" attribute.
    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function (next) {
    // this.populate('guides'); // getting all fields; pupulate - to make tours output look like guides were embedded (but they are referenced actually).
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt',
    });
    next();
});

tourSchema.post(/^find/, function (documents, next) {
    console.log(`Query took: ${Date.now() - this.start} milliseconds.`);
    next();
});

// aggregation middleware
// filter secret tours during aggregation (for getting tours stats)
// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { secret: { $ne: true } } }); // add alement at the beginning of the aggregation pipeline
//     next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
