/* eslint-disable */
import axios from 'axios';

import catchAsync from '../../utils/catchAsync';
import { showAlert } from './alerts';

const stripe = Stripe(
    'pk_test_51Puxf9JByfIhKfQbUEdatS7TUbC4MBjsTrNY5UsRDr3krYCW1l75MfNitwWJKhRQD6G1gJ6J8rc95nzuIytJzzlE00ObEwTY8Q'
);

export const bookTour = async tourId => {
    try {
        // The teacher did not add catchAsync.
        // 1. Get checkout session from API
        const checkoutSessionUrl = `/api/v1/bookings/checkout-session/${tourId}`;
        const session = await axios(checkoutSessionUrl);

        // console.log(session);

        // 2. Create checkout form + charge credit card
        window.location.replace(session.data.session.url);
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
