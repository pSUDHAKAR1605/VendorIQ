import axios from 'axios';

const getBaseURL = () => {
  // Check environment variable first
  const envURL = import.meta.env.VITE_API_URL;
  if (envURL) return envURL.endsWith('/') ? envURL : `${envURL}/`;

  // If we are on localhost, use the local backend as fallback
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api/';
  }
  
  // Production default
  return 'https://vendoriq-backend-d6sb.onrender.com/api/';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 60000, // Increased to 60s for Render cold starts
});

console.log('API Base URL:', api.defaults.baseURL);

// Debug interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`🚀 Request: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
  return config;
}, (error) => {
  console.error('❌ Request Error:', error);
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
      }
    });
    return Promise.reject(error);
  }
);

export default api;
