// admin/features/tables/tablesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../utils/axiosInstance";

export const fetchTables = createAsyncThunk("tables/fetchAll", async () => {
  const { data } = await adminApi.get("/tables");
  return data;
});

export const freeTableThunk = createAsyncThunk(
  "tables/free",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.put(`/tables/${id}/free`);
      return data;
    } catch (e) {
      return rejectWithValue(e?.response?.data || { error: "Failed to free" });
    }
  }
);

const tablesSlice = createSlice({
  name: "tables",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTables.pending, (s) => {
      s.loading = true;
      s.error = null;
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
        const idx = s.list.findIndex((t) => t._id === a.meta.arg);
        if (idx > -1) s.list[idx].status = "available";
      });
  },
});

export default tablesSlice.reducer;