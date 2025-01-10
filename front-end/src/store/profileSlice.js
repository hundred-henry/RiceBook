// src/store/slices/profileSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api";

// Thunks for Profile API operations

// 获取用户邮箱
export const fetchEmail = createAsyncThunk(
  "profile/fetchEmail",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/email/${username}`);
      return response.email;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch email address"
      );
    }
  }
);

// 更新用户邮箱
export const updateEmail = createAsyncThunk(
  "profile/updateEmail",
  async (newEmail, { rejectWithValue }) => {
    try {
      const response = await api.put("/email", { email: newEmail });
      return response.email;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update email");
    }
  }
);

// 获取用户邮政编码
export const fetchZipcode = createAsyncThunk(
  "profile/fetchZipcode",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/zipcode/${username}`);
      return response.zipcode;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch zipcode");
    }
  }
);

// 更新用户邮政编码
export const updateZipcode = createAsyncThunk(
  "profile/updateZipcode",
  async (newZipcode, { rejectWithValue }) => {
    try {
      const response = await api.put("/zipcode", { zipcode: newZipcode });
      return response.zipcode;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update zipcode"
      );
    }
  }
);

// 获取用户头像
export const fetchAvatar = createAsyncThunk(
  "profile/fetchAvatar",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/avatar/${username}`);
      return response.avatar;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch avatar");
    }
  }
);

// 更新用户头像
export const updateAvatar = createAsyncThunk(
  "profile/updateAvatar",
  async (newAvatar, { rejectWithValue }) => {
    try {
      const response = await api.put("/avatar", { avatar: newAvatar });
      return response.avatar;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update avatar");
    }
  }
);

// 获取用户出生日期
export const fetchDob = createAsyncThunk(
  "profile/fetchDob",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/dob/${username}`);
      return response.dob;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch DOB");
    }
  }
);

// 更新用户密码
export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async (newPassword, { rejectWithValue }) => {
    try {
      const response = await api.put("/password", { password: newPassword });
      return response.result;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update password"
      );
    }
  }
);

// 获取用户电话号码
export const fetchPhone = createAsyncThunk(
  "profile/fetchPhone",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/phone/${username}`);
      return response.phone;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch phone number"
      );
    }
  }
);

// 更新用户电话号码
export const updatePhone = createAsyncThunk(
  "profile/updatePhone",
  async (newPhone, { rejectWithValue }) => {
    try {
      const response = await api.put("/phone", { phone: newPhone });
      return response.phone;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update phone number"
      );
    }
  }
);

// 获取用户 headline
export const fetchHeadline = createAsyncThunk(
  "profile/fetchHeadline",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/headline/${username}`);
      return response.headline;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch headline"
      );
    }
  }
);

// 更新用户 headline
export const updateHeadline = createAsyncThunk(
  "profile/updateHeadline",
  async (newHeadline, { rejectWithValue }) => {
    try {
      // 修改这里，将键名从 newHeadline 改为 headline
      const response = await api.put("/headline", {
        headline: newHeadline.newHeadline,
      });
      return response.headline;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update headline"
      );
    }
  }
);

export const fetchFollowingDetails = createAsyncThunk(
  "following/fetchFollowingDetails",
  async (followingUsers, { rejectWithValue }) => {
    try {
      const response = await api.post("/following/details", {
        users: followingUsers,
      });
      return response.data; // 假设返回的数据格式为 { users: [{ username, avatar, headline }, ...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch following details"
      );
    }
  }
);

// Profile Slice
const profileSlice = createSlice({
  name: "profile",
  initialState: {
    email: null,
    zipcode: null,
    avatar: null,
    dob: null,
    phone: null,
    headline: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetProfileState(state) {
      state.email = null;
      state.zipcode = null;
      state.avatar = null;
      state.dob = null;
      state.phone = null;
      state.headline = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Email
      .addCase(fetchEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.payload;
      })
      .addCase(fetchEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Email
      .addCase(updateEmail.fulfilled, (state, action) => {
        state.email = action.payload;
      })
      // Fetch Zipcode
      .addCase(fetchZipcode.fulfilled, (state, action) => {
        state.zipcode = action.payload;
      })
      // Update Zipcode
      .addCase(updateZipcode.fulfilled, (state, action) => {
        state.zipcode = action.payload;
      })
      // Fetch Avatar
      .addCase(fetchAvatar.fulfilled, (state, action) => {
        state.avatar = action.payload;
      })
      // Update Avatar
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.avatar = action.payload;
      })
      // Fetch DOB
      .addCase(fetchDob.fulfilled, (state, action) => {
        state.dob = action.payload;
      })
      // Fetch Phone
      .addCase(fetchPhone.fulfilled, (state, action) => {
        state.phone = action.payload;
      })
      // Update Phone
      .addCase(updatePhone.fulfilled, (state, action) => {
        state.phone = action.payload;
      })
      // Fetch Headline
      .addCase(fetchHeadline.fulfilled, (state, action) => {
        state.headline = action.payload;
      })
      // Update Headline
      .addCase(updateHeadline.fulfilled, (state, action) => {
        state.headline = action.payload;
      })
      // Update Password
      .addCase(updatePassword.fulfilled, (state) => {
        state.error = null;
      });
  },
});

// Export Actions and Reducer
export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;