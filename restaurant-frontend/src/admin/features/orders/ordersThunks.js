import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../utils/axiosInstance";

// Fetch recent orders
export const fetchRecentOrders = createAsyncThunk("orders/fetchRecent", async () => {
  const { data } = await adminApi.get("/orders/recent");
  return data;
});

// Fetch all orders
export const fetchAllOrders = createAsyncThunk("orders/fetchAll", async () => {
  const { data } = await adminApi.get("/orders");
  console.log(data)
  return data;
});

// ✅ Update order status + dispatch local update
export const updateOrderStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }, { dispatch }) => {
    const { data } = await adminApi.put(`/orders/${id}/status`, { status });

    // Dispatch local update after API success
    dispatch({
      type: "orders/updateStatusLocal",
      payload: { id, status },
    });

    return data;
  }
);

// Fetch order bill
export const fetchOrderBill = createAsyncThunk("orders/fetchBill", async (id) => {
  const { data } = await adminApi.get(`/orders/${id}/bill`);
  return data; // { order, totals }
});
