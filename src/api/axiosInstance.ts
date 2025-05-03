import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7141/api';

const axiosInstance = axios.create({
  baseURL: API_URL, // Temel API 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Interceptor: Token added to request headers'); 
    } else {
      console.log('Interceptor: No token found'); 
    }
    return config;
  },
  (error) => {
    console.error('Interceptor Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Interceptor Response Error:', error.response?.status, error.message);
    if (error.response && error.response.status === 401) {
      
      console.log('Interceptor: Received 401, logging out...');
      localStorage.removeItem('authToken');
      
      
      
      window.location.href = '/'; 
    }
    return Promise.reject(error); 
  }
);


export default axiosInstance; 