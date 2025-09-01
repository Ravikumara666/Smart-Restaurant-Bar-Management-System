import { createSlice } from "@reduxjs/toolkit";
import { fetchRecentOrders, fetchAllOrders, fetchOrderBill, markOrderCompleteThunk } from "./ordersThunks";

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
    markCompleteLocal(state, action) {
      const id = action.payload;
      const updateList = (list) => {
        const order = list.find((o) => o._id === id);
        if (order) order.status = "completed";
      };
      updateList(state.recent);
      updateList(state.all);
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
      })

      .addCase(fetchOrderBill.fulfilled, (state, action) => {
        state.bill = action.payload;
      })

      // ✅ Handle local status update instantly
      .addCase("orders/updateStatusLocal", (state, action) => {
        const { id, status } = action.payload;

        // Update in recent
        const updateList = (list) => {
          const order = list.find((o) => o._id === id);
          if (order) order.status = status;
        };

        updateList(state.recent);
        updateList(state.all);
      })

      .addCase(markOrderCompleteThunk.fulfilled, (state, action) => {
        const id = action.payload._id;
        const updateList = (list) => {
          const order = list.find((o) => o._id === id);
          if (order) order.status = "completed";
        };
        updateList(state.recent);
        updateList(state.all);
      });
  },
});

export const { setBill, clearBill, markCompleteLocal } = ordersSlice.actions;
export default ordersSlice.reducer;
