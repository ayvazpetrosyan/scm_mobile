import { create } from 'axios';

const API = create({
    baseURL: 'http://laravel_auth.loc/api/am',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default API;
