import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// 异步 Thunk：获取关注列表
export const fetchFollowing = createAsyncThunk(
  "following/fetchFollowing",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/following");
      return response.following; // 假设后端返回 { following: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch following"
      );
    }
  }
);

// 异步 Thunk：添加关注
export const addFollowing = createAsyncThunk(
  "following/addFollowing",
  async (userToFollow, { rejectWithValue }) => {
    try {
      const response = await api.put(`/following/${userToFollow}`);
      return response.following; // 假设后端返回 { following: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add following");
    }
  }
);

// 异步 Thunk：取消关注
export const removeFollowing = createAsyncThunk(
  "following/removeFollowing",
  async (userToRemove, { rejectWithValue }) => {
    try {
      console.log(userToRemove);
      const response = await api.delete(`/following/${userToRemove}`);
      return response.following; // 假设后端返回 { following: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to remove following"
      );
    }
  }
);

const followingSlice = createSlice({
  name: "following",
  initialState: {
    followingUsers: [], // 添加 followingUsers 到 initialState
    loading: false,
    error: null,
  },
  reducers: {
    resetFollowingState(state) {
      state.followingUsers = []; // 重置 followingUsers
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.followingUsers = action.payload; // 将获取到的数据存储到 state 中
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.followingUsers = action.payload; // 更新 followingUsers 数据
      })
      .addCase(removeFollowing.fulfilled, (state, action) => {
        state.loading = false;
        state.followingUsers = action.payload; // 更新 followingUsers 数据
      });
  },
});

export const { resetFollowingState } = followingSlice.actions;
export default followingSlice.reducer;
