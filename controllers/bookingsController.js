const stripe = require('stripe')(process.env.PAYMENTS_TOOL_SECRET_KEY);

const Tour = require('../models/toursModel');
const Booking = require('../models/bookingsModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1. Get tour currently being booked.
    const tour = await Tour.findById(req.params.tourId);

    const successUrlQueryString = `/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`;

    // 2. Crate checkout session.
    const session = await stripe.checkout.sessions.create({
        // session info
        payment_method_types: ['card'],
        mode: 'payment',
        success_url:
            process.env.NODE_ENV === 'production'
                ? `${req.protocol}://${req.get('host')}${successUrlQueryString}`
                : `${req.protocol}://localhost:3000${successUrlQueryString}`,
        // NOT SECURE!!! Right now anyone who knows this success URL structure here could simply call it without going through the checkout process. So anyone really could just book a tour without paying.
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

// creating booking after payment
exports.createBookingAfterCheckout = catchAsync(async (req, res, next) => {
    // only temporary for development, not production - It's unsecure - everyone can make a booking without paying.
    const { tour, user, price } = req.query;
    if (!tour || !user || !price) return next();
    await Booking.create({ tour, user, price });

    // next(); // We should not use it because then we get redirected to homepage with query string having booking details if we made a payment before and then success url after checkout is revealed to the user. So we need to clean URL when redirecting to home9page after checkout.
    res.redirect(req.originalUrl.split('?')[0]);
});
