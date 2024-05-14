/* eslint-disable */

const login = async (email, password) => {
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
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        alert(err.response.data.message);
    }
};

document.querySelector('.form').addEventListener('submit', e => {
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
