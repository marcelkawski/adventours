const stripe = require('stripe')(process.env.PAYMENTS_TOOL_SECRET_KEY);

const Tour = require('../models/toursModel');
// const User = require('../models/usersModel');
const Booking = require('../models/bookingsModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// CRUD operations
exports.getBookingById = factory.getOneById(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBookingById = factory.updateOneById(Booking);
exports.deleteBookingById = factory.deleteOneById(Booking);

// checkout
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    // 1. Get tour currently being booked.
    const tour = await Tour.findById(req.params.tourId);

    const successUrlQueryString = `/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`;

    // 2. Crate checkout session.
    const session = await stripe.checkout.sessions.create({
        // session info
        payment_method_types: ['card'],
        mode: 'payment',
        // for real deployed production we should use this success_url: `${req.protocol}://${req.get('host')}?alert=booking`
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
                            // We should use this URL: `${req.protocol}://${req.get('host')}` to get images when using deployed production app
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

// for deployed production app
// exports.createBookingAfterCheckoutWhenUsingWebhooks = async session => {
//     const tour = session.client_reference_id;
//     const user = (await User.findOne({ email: session.customer_email })).id;
//     // or maybe "display_items" instead of "line_items" on deployed production app (because of last lecture in course when it was changed for display_items)
//     const price = session.line_items[0].amount / 100;
//     await Booking.create({ tour, user, price });
// };

// exports.webhookCheckout = (req, res, next) => {
//     const signature = req.headers['stripe-signature'];

//     let event;
//     try {
//         event = stripe.webhooks.constructEvent(
//             req.body,
//             signature,
//             process.env.PAYMENTS_TOOL_WEBHOOK_SECRET_KEY
//         );
//     } catch (err) {
//         return res.status(400).send(`Webhook error: ${err.message}`);
//     }

//     if (event.type === 'checkout.session.completed')
//         await this.createBookingAfterCheckoutWhenUsingWebhooks(event.data.object);

//     res.status(200).json({ received: true });
// };
