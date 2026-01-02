import axios from 'axios';

const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_URL;
  if (envURL) return envURL.endsWith('/') ? envURL : `${envURL}/`;
  return 'https://vendoriq-backend-d6sb.onrender.com/api/';
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
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
