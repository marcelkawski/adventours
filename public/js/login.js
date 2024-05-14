/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email,
                password,
            },
        });

        if (res.data.status === 'success') {
            // alert('Logged in successfully.');
            // Redirect to homepage after 1.5 s.
            showAlert('success', 'Logged in successfully.');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        // alert(err.response.data.message);
        showAlert('error', err.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });
        if (res.data.status === 'success') location.reload(true); // Before we had to refresh the page manually after removing the jwt.
        // true mean we want to reaload from the server, not from the browser cache.
    } catch (err) {
        showAlert('error', 'Error logging out. Try again.');
    }
};
