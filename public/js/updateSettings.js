/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Beofre it was function just to update name and email of the user. But function for updating password would be the same, so we refactored it to be able to use just one for both.
// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
    try {
        // This condition should be done in better way to avoid accepting values other than 'password' and 'data'.
        const url =
            type === 'password'
                ? 'http://localhost:3000/api/v1/users/updatePassword'
                : 'http://localhost:3000/api/v1/users/updateMe';

        console.log(url);
        console.log(data);

        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                `${
                    type.charAt(0).toUpperCase() + type.slice(1)
                } updated successfully.`
            );
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
