export const API_CONFIG = {
    BASE_URL: 'http://localhost:8080',
    API_VERSION: '/api/v1.0',
};

export const getBaseUrl = () => `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}`;
