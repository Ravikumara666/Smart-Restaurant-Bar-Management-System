// utils/menuApi.js
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/menu";

// Get all menu items
export const getMenuItems = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch menu items");
  }
};

// Add a new menu item
export const addMenuItem = async (item) => {
  try {
    const res = await axios.post(BASE_URL, item, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add menu item");
  }
};

// Update a menu item
export const updateMenuItem = async (id, updatedItem) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, updatedItem, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update menu item");
  }
};

// Delete a menu item
export const deleteMenuItem = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete menu item");
  }
};