/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const logInForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

// for Mapbox
if (mapBox) {
    const locations = JSON.parse(
        document.getElementById('map').dataset.locations
    );
    displayMap(locations);
    // const locations = JSON.parse(dataset.locations);
    // displayMap(locations);
}

// for logging in (taken from login.js file)
if (logInForm)
    logInForm.addEventListener('submit', e => {
        /*
We normally prevent submit behaviour to check some validation before submitting the form or we need to change values of our input fields or we want to submit using ajax calls. For this purpose, we prevent form to be submitted by using:

event.preventDefault();
// Here comes our custom logic
*/
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm)
    userDataForm.addEventListener('submit', e => {
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        updateSettings(form, 'data');
    });

if (userPasswordForm)
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent =
            'Updating...';

        const currentPassword =
            document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm =
            document.getElementById('password-confirm').value;
        // await is to wait until the password is updated and then perform some other actions.
        await updateSettings(
            { currentPassword, password, passwordConfirm },
            'password'
        );

        document.querySelector('.btn--save-password').textContent =
            'Save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
