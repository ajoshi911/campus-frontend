import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

console.log("API URL:", API_URL); // ✅ debug

if (!API_URL) {
  throw new Error("❌ VITE_API_URL is NOT set");
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // NO fallback
});

/* Attach JWT token */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('tcet_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Handle 401 */
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;