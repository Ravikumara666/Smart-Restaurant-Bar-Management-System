// admin/features/menu/menuSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi, publicApi } from "../../utils/axiosInstance";

// ✅ Fetch all menu items
export const fetchMenu = createAsyncThunk("menu/fetch", async () => {
  const { data } = await publicApi.get("/menu");
  return data;
});

// ✅ Add menu item
export const addMenuItem = createAsyncThunk("menu/add", async (formData) => {
  const { data } = await adminApi.post("/menu", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.menuItem;
});

// ✅ Update menu item
export const updateMenuItem = createAsyncThunk(
  "menu/update",
  async ({ id, data: formData }) => {
    const { data } = await adminApi.put(`/menu/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }
);

// ✅ Delete menu item
export const deleteMenuItem = createAsyncThunk("menu/delete", async (id) => {
  await adminApi.delete(`/menu/${id}`);
  return id; // return deleted ID
});

// ✅ Toggle stock
export const toggleStock = createAsyncThunk("menu/toggleStock", async (id) => {
  const { data } = await adminApi.put(`/menu/${id}/toggle-stock`);
  return data;
});

const menuSlice = createSlice({
  name: "menu",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.list.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })

      // Delete
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.list = state.list.filter((m) => m._id !== action.payload);
      })

      // Toggle Stock
      .addCase(toggleStock.fulfilled, (state, action) => {
        const index = state.list.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default menuSlice.reducer;
