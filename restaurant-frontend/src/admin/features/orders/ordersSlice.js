// admin/features/orders/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchRecentOrders, fetchAllOrders } from "./ordersThunks";

const initialState = {
  recent: [],
  all: [],
  bill: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setBill(state, action) {
      state.bill = action.payload;
    },
    clearBill(state) {
      state.bill = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recent = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setBill, clearBill } = ordersSlice.actions;
export default ordersSlice.reducer;