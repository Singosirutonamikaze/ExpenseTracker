import axios from 'axios';

import { API_BASE_URL } from './apiPath';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: false, // Pour les cookies de session si nécessaire
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
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                //Redirect to Login
                window.location.href = '/login';
                console.error("Accès non autorisé, redirection vers la page de connexion");
            } else if (status === 500) {
                console.error(`Erreur 500: ${data.message || 'Erreur interne du serveur, veuillez réessayer plus tard.'}`);
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error("La requête a expiré, veuillez réessayer.");
        }
        
        console.error("Détails de l'erreur:", {
            message: error.message,
            config: error.config,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            } : null,
            request: error.request ? {
                responseURL: error.request.responseURL,
                responseType: error.request.responseType,
                status: error.request.status
            } : null
        });

        return Promise.reject(error);
    }
);

export default axiosInstance;