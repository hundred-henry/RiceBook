// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// 异步 Thunk：检查登录状态
export const checkLoginStatus = createAsyncThunk(
  "user/checkLoginStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/status"); // 后端应返回当前用户状态
      return response;
    } catch (error) {
      return rejectWithValue("Not logged in");
    }
  }
);

// 异步 Thunk：用户登录
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", { username, password });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// 异步 Thunk：用户登出
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.put("/logout");
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetUserState(state) {
      state.isLoggedIn = false;
      state.currentUser = null;
      state.error = null;
    },
    clearUserState: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登出成功
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.currentUser = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.error("Logout failed:", action.payload);
      })
      // 检查登录状态
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.currentUser = action.payload;
      })
      .addCase(checkLoginStatus.rejected, (state) => {
        state.isLoggedIn = false;
        state.currentUser = null;
      })
      // 登录
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.error = action.payload;
      });
  },
});

export const { resetUserState, clearUserState } = userSlice.actions;
export default userSlice.reducer;
