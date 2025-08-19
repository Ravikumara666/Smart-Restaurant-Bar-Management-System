// admin/features/menu/menuSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { publicApi, adminApi } from "../../utils/axiosInstance";

// ✅ Public: fetch all menu items
export const fetchMenu = createAsyncThunk("menu/fetch", async () => {
  const { data } = await publicApi.get("/menu");
  return data;
});

// ✅ Admin: toggle stock/availability
export const toggleStock = createAsyncThunk("menu/toggleStock", async (id) => {
  console.log("clickg...");
  const { data } = await adminApi.put(`/menu/${id}/toggle-stock`);
  console.log("toggled:", data);
  return data; // updated menu item
});

const menuSlice = createSlice({
  name: "menu",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch menu
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

      // Toggle stock
      .addCase(toggleStock.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const idx = state.list.findIndex((m) => m._id === updatedItem._id);
        if (idx > -1) {
          state.list[idx] = updatedItem; // overwrite with updated version
        }
      })
      .addCase(toggleStock.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default menuSlice.reducer;