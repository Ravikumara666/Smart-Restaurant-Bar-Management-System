// admin/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminApi } from "../../utils/axiosInstance";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }) => {
    const { data } = await adminApi.post("/login", { email, password });
    return data; // { token, user }
  }
);

const tokenFromStorage = localStorage.getItem("admin_token");
const userFromStorage = localStorage.getItem("admin_user");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage ? JSON.parse(userFromStorage) : null,
    token: tokenFromStorage || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
        localStorage.setItem("admin_token", a.payload.token);
        localStorage.setItem("admin_user", JSON.stringify(a.payload.user));
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error?.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;