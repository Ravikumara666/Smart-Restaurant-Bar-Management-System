// admin/utils/axiosInstance.js
import axios from "axios";

const normalizeBaseUrl = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return `http://${url}`;
  return url;
};

const baseURL = normalizeBaseUrl(import.meta.env.VITE_ADMIN_BASE_URL);

// 🔹 Admin API (no token handling for now)
export const adminApi = axios.create({ baseURL, withCredentials: false });

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      console.warn("Unauthorized request – login not implemented yet.");
    }
    return Promise.reject(err);
  }
);

// 🔹 Public API (menu, checkout, etc.)
export const publicApi = axios.create({
  baseURL: normalizeBaseUrl(import.meta.env.VITE_PUBLIC_BASE_URL),
});