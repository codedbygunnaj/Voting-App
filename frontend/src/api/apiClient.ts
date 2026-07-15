// src/api/apiClient.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3200', // Tera backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR: Har request server tak pahunchne se pehle yahan se guzregi
apiClient.interceptors.request.use(
  (config) => {
    // Browser ki memory se token uthao
    const token = localStorage.getItem('token');
    
    // Agar token hai, toh Authorization header set kardo
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;