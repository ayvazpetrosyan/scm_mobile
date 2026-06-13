import { create } from 'axios';

const ApiService = create({
    // baseURL: 'https://schoolm.ohanyan.org/api/am',
    baseURL: 'http://laravel_auth.loc/api/am',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default ApiService;
