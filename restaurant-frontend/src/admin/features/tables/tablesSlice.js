import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../utils/axiosInstance";

// ✅ Fetch tables
export const fetchTables = createAsyncThunk("tables/fetchAll", async () => {
  const { data } = await adminApi.get("/tables");
  return data;
});

// ✅ Free table
export const freeTableThunk = createAsyncThunk("tables/free", async (id) => {
  const { data } = await adminApi.put(`/tables/${id}/free`);
  return data;
});

// ✅ Add table
export const addTableThunk = createAsyncThunk("tables/add", async (tableData) => {
  const { data } = await adminApi.post("/tables", tableData);
  return data;
});

// ✅ Update table
export const updateTableThunk = createAsyncThunk("tables/update", async ({ id, data: tableData }) => {
  const { data } = await adminApi.put(`/tables/${id}`, tableData);
  return data;
});

// ✅ Delete table
export const deleteTableThunk = createAsyncThunk("tables/delete", async (id) => {
  await adminApi.delete(`/tables/${id}`);
  return id;
});

const tablesSlice = createSlice({
  name: "tables",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTables.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchTables.fulfilled, (s, a) => {
        s.loading = false;
        s.list = a.payload;
      })
      .addCase(fetchTables.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error.message;
      })
      .addCase(freeTableThunk.fulfilled, (s, a) => {
        const idx = s.list.findIndex((t) => t._id === a.payload._id);
        if (idx > -1) s.list[idx] = a.payload;
      })
      .addCase(addTableThunk.fulfilled, (s, a) => {
        s.list.push(a.payload);
      })
      .addCase(updateTableThunk.fulfilled, (s, a) => {
        const idx = s.list.findIndex((t) => t._id === a.payload._id);
        if (idx > -1) s.list[idx] = a.payload;
      })
      .addCase(deleteTableThunk.fulfilled, (s, a) => {
        s.list = s.list.filter((t) => t._id !== a.payload);
      });
  },
});

export default tablesSlice.reducer;
