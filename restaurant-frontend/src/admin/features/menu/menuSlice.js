import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicApi, adminApi } from "../../utils/axiosInstance";

// ✅ Fetch all menu items (Public)
export const fetchMenu = createAsyncThunk("menu/fetch", async () => {
  const { data } = await publicApi.get("/menu");
  return data;
});

// ✅ Toggle stock (Admin)
export const toggleStock = createAsyncThunk("menu/toggleStock", async (id) => {
  try {
    const { data } = await adminApi.put(`/menu/${id}/toggle-stock`);
    return data; // updated menu item
  } catch (e) {
    console.error("Error toggling stock:", e);
    throw e;
  }
});

// ✅ Add new menu item (with image)
export const addMenuItem = createAsyncThunk("menu/addMenuItem", async (formData) => {
  const { data } = await adminApi.post("/menu", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.menuItem;
});

// ✅ Update existing menu item (with optional image)
export const updateMenuItem = createAsyncThunk("menu/updateMenuItem", async ({ id, data }) => {
  const res = await adminApi.put(`/menu/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
});

const menuSlice = createSlice({
  name: "menu",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ Fetch menu
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // ✅ Toggle stock
      .addCase(toggleStock.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const idx = state.list.findIndex((m) => m._id === updatedItem._id);
        if (idx > -1) {
          state.list[idx] = updatedItem;
        }
      })
      .addCase(toggleStock.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // ✅ Add menu item
      .addCase(addMenuItem.fulfilled, (state, action) => {
        state.list.push(action.payload); // Add new item at the end
      })
      .addCase(addMenuItem.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // ✅ Update menu item
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const idx = state.list.findIndex((m) => m._id === updatedItem._id);
        if (idx > -1) {
          state.list[idx] = updatedItem;
        }
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default menuSlice.reducer;
