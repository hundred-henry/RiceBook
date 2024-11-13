// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define initial state
const initialState = {
  userId: null, // Current logged-in user ID
  userAvatar: null, // Current logged-in user's avatar
  users: [], // All user information
  status: "idle", // Request status
  error: null, // Error information
};

// Fetch users async action
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();

  // Add avatar and default followedUsers for each user
  const usersWithAvatarsAndFollowed = data.map((user, index, array) => {
    const followedUsers = [
      array[(index + 1) % array.length].id,
      array[(index + 2) % array.length].id,
      array[(index + 3) % array.length].id,
    ];

    // Retrieve catchPhrase from localStorage if available
    const savedCatchPhrase = localStorage.getItem(
      `user-${user.id}-catchPhrase`
    );

    return {
      ...user,
      avatar: `https://i.pravatar.cc/150?img=${user.id}`,
      followedUsers,
      company: {
        ...user.company,
        catchPhrase: savedCatchPhrase || user.company.catchPhrase,
      },
    };
  });

  return usersWithAvatarsAndFollowed;
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.userId = action.payload.userId;
      const currentUser = state.users.find(
        (user) => user.id === action.payload.userId
      );
      state.userAvatar = currentUser ? currentUser.avatar : null;
    },
    logoutUser: (state) => {
      state.userId = null;
      state.userAvatar = null;
    },
    updateCatchPhrase: (state, action) => {
      const { userId, newCatchPhrase } = action.payload;
      const user = state.users.find((user) => user.id === userId);
      if (user) {
        user.company.catchPhrase = newCatchPhrase;
        // Persist the updated catchPhrase in localStorage
        localStorage.setItem(`user-${userId}-catchPhrase`, newCatchPhrase);
      }
    },
    addNewUser: (state, action) => {
      const newUser = {
        id: action.payload.id,
        username: action.payload.username,
        catchPhrase: "",
        avatar: action.payload.avatar || "",
        followedUsers: [],
      };
      state.users.push(newUser);
    },
    updateFollowedUsers: (state, action) => {
      const { userId, followedUsers } = action.payload;
      const user = state.users.find((user) => user.id === userId);
      if (user) {
        user.followedUsers = followedUsers;
      }
    },
    updateUserDetails: (state, action) => {
      const { userId, username, name, password, email, phone, zipcode } =
        action.payload;
      const user = state.users.find((user) => user.id === userId);

      if (user) {
        user.username = username;
        user.name = name;
        user.password = password;
        user.email = email;
        user.phone = phone;
        user.address.zipcode = zipcode;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  loginUser,
  logoutUser,
  updateCatchPhrase,
  updateFollowedUsers,
  updateUserDetails,
  addNewUser,
} = userSlice.actions;

export default userSlice.reducer;

export const selectFollowedUsersById = (state, userId) => {
  const user = state.user.users.find((user) => user.id === userId);
  return user ? user.followedUsers : [];
};
