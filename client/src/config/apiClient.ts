import axios from "axios";
import { API } from "./api";

const apiClient = axios.create({
  baseURL: API.BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT auth header to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap ilearn-server response format { data, status, message }
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // On 401, try to refresh token
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post(API.BASEURL + API.AUTH_REFRESH, {
            refreshToken,
          });
          if (res.data?.token) {
            localStorage.setItem("adminToken", res.data.token);
            if (res.data.refreshToken) {
              localStorage.setItem("refreshToken", res.data.refreshToken);
            }
            // Retry original request
            error.config.headers.Authorization = `Bearer ${res.data.token}`;
            return apiClient(error.config);
          }
        } catch (refreshError) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("refreshToken");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
