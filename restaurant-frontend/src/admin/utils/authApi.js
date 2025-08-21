import axios from "axios";

const normalizeBaseUrl = (url) => {
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) return `http://${url}`;
  return url;
};

const baseURL = normalizeBaseUrl(import.meta.env.VITE_ADMIN_BASE_URL);

// ✅ Create Axios instance
export const authApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json", // ✅ Force JSON header
  },
});

// ✅ Admin Login API
export const adminLoginApi = async (credentials) => {
  try {
    const res = await authApi.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    console.error("❌ Login API Error:", error.response || error.message);
    throw error;
  }
};
