import axios from 'axios';

// Create an axios instance
// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const baseURL = import.meta.env.VITE_API_URL || 'https://ledgercheck.onrender.com';
console.log("🔌 Connecting to API:", baseURL); // DEBUG: Check what URL we are using!

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
