// utils/menuApi.js
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all menu items
export const getMenuItems = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/menu`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch menu items");
  }
};