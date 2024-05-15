/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const logInForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');

// for Mapbox
if (mapBox) {
    const locations = JSON.parse(dataset.locations);
    displayMap(locations);
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
