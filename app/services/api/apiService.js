import { create } from 'axios';

const ApiService = create({
    baseURL: `${process.env.EXPO_PUBLIC_BASE_URL}/api/am`,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

export default ApiService;
