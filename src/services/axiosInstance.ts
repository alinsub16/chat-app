// src/api/axiosInstance.ts
import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // needed if your backend sets cookies
});

// Request interceptor → attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → handle refresh token if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          "/auth/refresh",
          {},
          { baseURL: api.defaults.baseURL, withCredentials: true }
        );

        const newToken = refreshRes.data.token;
        localStorage.setItem("token", newToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return api(originalRequest); // retry the request
      } catch (refreshError) {
        localStorage.removeItem("token");
        window.location.href = "/login"; // force logout
      }
    }

    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const backendMessage = error.response?.data?.message || "Something went wrong";
    const backendErrors = error.response?.data?.errors || [];

    console.error("❌ API Error:", error.response?.data);

    // Normalize error shape so all catches can read .message
    return Promise.reject({
      ...error,
      message: backendMessage,
      errors: backendErrors,
      status: error.response?.status,
    });
  }
);
export default api;
