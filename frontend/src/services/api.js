import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token if it exists
apiClient.interceptors.request.use(
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

// Response Interceptor: Handle errors globally (e.g. 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear expired credentials and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Prevent infinite redirect loops if already on login/register page
        const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
        const isPublicPath = publicPaths.some(path => window.location.pathname.startsWith(path));
        if (!isPublicPath && window.location.pathname !== '/') {
          window.location.href = '/login?expired=true';
        }
      }
      
      if (error.response.status === 429) {
        // Dispatch custom rate limit window event
        window.dispatchEvent(new CustomEvent('api-rate-limit'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
