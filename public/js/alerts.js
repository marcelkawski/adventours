/* eslint-disable */

export const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg) => {
    // Hide all other alerts before:
    hideAlert();

    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

    // Hide the alert after 5 seconds.
    window.setTimeout(hideAlert, 5000);
};
