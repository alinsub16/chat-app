import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://chat-app-server-6wr5.onrender.com/api",
  withCredentials: true,
});

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config || {};

    const backendMessage =
      error.response?.data?.message || "Something went wrong";

    const backendErrors = error.response?.data?.errors || [];

    console.error("❌ API Error:", error.response?.data);

    // =========================
    // TOKEN EXPIRED FLOW
    // =========================
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(
          "/auth/refresh",
          {},
          {
            baseURL: api.defaults.baseURL,
            withCredentials: true,
          }
        );

        const newToken = refreshRes.data.token;

        localStorage.setItem("token", newToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return api(originalRequest);
      } catch (refreshError) {
        // 🔥 AUTO LOGOUT
        localStorage.removeItem("token");

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }

    // =========================
    // NORMAL ERROR RETURN
    // =========================
    return Promise.reject({
      ...error,
      message: backendMessage,
      errors: backendErrors,
      status: error.response?.status,
    });
  }
);

export default api;