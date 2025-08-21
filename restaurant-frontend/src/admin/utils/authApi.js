import axios from "axios";

const normalizeBaseUrl = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return `http://${url}`;
  return url;
};

const baseURL = normalizeBaseUrl(import.meta.env.VITE_ADMIN_BASE_URL);

export const authApi = axios.create({
  baseURL,
});

export const adminLoginApi = async (credentials) => {
  const res = await authApi.post("/auth/login", credentials);
  return res.data;
};
