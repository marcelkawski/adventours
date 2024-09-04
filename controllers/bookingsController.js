const stripe = require('stripe')(process.env.PAYMENTS_TOOL_SECRET_KEY);

const Tour = require('./../models/toursModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1. Get tour currently being booked.
    const tour = await Tour.findById(req.params.tourId);

    console.log(tour);

    // 2. Crate checkout session.
    const session = await stripe.checkout.sessions.create({
        // session info
        payment_method_types: ['card'],
        mode: 'payment',
        success_url:
            process.env.NODE_ENV === 'production'
                ? `${req.protocol}://${req.get('host')}`
                : `${req.protocol}://localhost:3000`,
        cancel_url:
            process.env.NODE_ENV === 'production'
                ? `${req.protocol}://${req.get('host')}/tour/${tour.slug}`
                : `${req.protocol}://localhost:3000/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        // product info
        line_items: [
            {
                quantity: 1,
                price_data: {
                    currency: 'usd',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `https://www.natours.dev/img/tours/${tour.imageCover}`,
                        ],
                    },
                },
            },
        ],
    });

    // 3. Send it to client (frontend)
    res.status(200).json({
        status: 'success',
        session,
    });
});
