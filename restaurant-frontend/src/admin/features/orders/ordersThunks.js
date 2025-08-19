// admin/features/orders/ordersThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../utils/axiosInstance";

export const fetchRecentOrders = createAsyncThunk(
  "orders/fetchRecent",
  async () => {
    const { data } = await adminApi.get("/orders/recent");
    console.log("Recent Orders API response:", data); // 🟢 Debug
    return data;
  }
);

export const fetchAllOrders = createAsyncThunk("orders/fetchAll", async () => {
  const { data } = await adminApi.get("/orders");
  return data;
});

export const updateOrderStatusThunk = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, status }) => {
    const { data } = await adminApi.put(`/orders/${id}/status`, { status });
    return data;
  }
);

export const fetchOrderBill = createAsyncThunk(
  "orders/fetchBill",
  async (id) => {
    const { data } = await adminApi.get(`/orders/${id}/bill`);
    return data; // {order, totals}
  }
);