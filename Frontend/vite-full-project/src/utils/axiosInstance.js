import axios from 'axios';

import { API_BASE_URL } from './apiPath';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // You can add token or other headers here if needed
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Receive error responses and handle them
        if( error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                //Redirect to Login
                window.location.href = '/login';
                console.error("Accès non autorisé, redirection vers la page de connexion");
            } else if (status === 500) {
                console.error(`Erreur 500: ${data.message || 'Erreur interne du serveur, veuillez réessayer plus tard.'}`);
            }
        } else  if (error.code === 'ECONNABORTED') {
            console.error("La requête a expiré, veuillez réessayer.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;