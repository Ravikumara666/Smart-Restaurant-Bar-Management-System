import axios from "axios";

// ✅ Normalize URL
const normalizeBaseUrl = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return `http://${url}`;
  return url;
};

// ✅ Base URLs from environment variables
const adminBaseURL = normalizeBaseUrl(import.meta.env.VITE_ADMIN_BASE_URL);
const publicBaseURL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

// ✅ Get token helper
const getToken = () => localStorage.getItem("adminToken");

// 🔹 Admin API instance
export const adminApi = axios.create({
  baseURL: adminBaseURL,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor for token
adminApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor for handling errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      console.warn("⚠ Unauthorized! Redirecting to login...");
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login"; // ✅ Redirect on 401
    }
    return Promise.reject(error);
  }
);

// 🔹 Public API instance
export const publicApi = axios.create({
  baseURL: publicBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
