// LeftBar.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  Paper,
  InputBase,
  IconButton,
  Divider,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  logoutUser,
  selectFollowedUsersById,
  updateFollowedUsers,
  updateCatchPhrase,
} from "../features/userSlice";
import logo from "../features/logo.png";
import SearchIcon from "@mui/icons-material/Search";

const SearchField = ({ placeholder, value, onChange }) => (
  <Paper
    component="form"
    sx={{
      display: "flex",
      alignItems: "center",
      padding: "2px 8px",
      flexGrow: 1,
      borderRadius: 3,
      boxShadow: 2,
      height: "40px",
    }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1, height: "30px", padding: "2px" }}
      placeholder={placeholder}
      inputProps={{ "aria-label": placeholder }}
      value={value}
      onChange={onChange}
    />
    <IconButton type="button" sx={{ p: "5px" }}>
      <SearchIcon />
    </IconButton>
  </Paper>
);

const LeftBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.user.userId);
  const users = useSelector((state) => state.user.users);
  const currentUser = useSelector((state) =>
    state.user.users.find((user) => user.id === userId)
  );
  const followedUsers = useSelector((state) =>
    selectFollowedUsersById(state, userId)
  );

  const [newFollower, setNewFollower] = useState("");
  const [newUserStatus, setNewUserStatus] = useState("");
  const [followerMessage, setFollowerMessage] = useState(null); // For success/error messages when adding a follower

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const handleProfile = () => {
    navigate(`/profile/${userId}`);
  };

  const handleAddFollower = () => {
    const existingUser = users.find((user) => user.username === newFollower);
    if (existingUser) {
      // Add the existing user to followed users
      dispatch(
        updateFollowedUsers({
          userId: currentUser.id,
          followedUsers: [...currentUser.followedUsers, existingUser.id],
        })
      );
      setFollowerMessage({
        type: "success",
        text: `Successfully followed ${newFollower}`,
      });
    } else {
      // Show error message if the user does not exist
      setFollowerMessage({
        type: "error",
        text: `User "${newFollower}" does not exist`,
      });
    }
    setNewFollower("");
  };

  const handleUnfollow = (unfollowedUserId) => {
    const updatedFollowedUsers = currentUser.followedUsers.filter(
      (id) => id !== unfollowedUserId
    );
    dispatch(
      updateFollowedUsers({
        userId: currentUser.id,
        followedUsers: updatedFollowedUsers,
      })
    );
  };

  const handleUpdateUserStatus = () => {
    if (newUserStatus.trim()) {
      dispatch(
        updateCatchPhrase({
          userId: currentUser.id,
          newCatchPhrase: newUserStatus,
        })
      );
      setNewUserStatus("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        marginTop: "10px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <img
          src={logo}
          alt="Logo"
          style={{ width: "70px", marginRight: "20px" }}
        />
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Orbitron, sans-serif",
            fontWeight: "bold",
            fontSize: "24px",
            marginTop: "5px",
          }}
        >
          RiceBook
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          marginBottom: "20px",
        }}
      >
        <Button variant="contained" color="secondary" onClick={handleProfile}>
          Profile
        </Button>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          fontSize: "24px",
          color: "primary.main",
          textAlign: "left",
          marginBottom: "10px",
        }}
      >
        Following:
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          marginBottom: "20px",
          width: "100%",
        }}
      >
        <SearchField
          placeholder="Search for follower"
          value={newFollower}
          onChange={(e) => setNewFollower(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddFollower}>
          Add
        </Button>
      </Box>

      {/* Message area for adding follower */}
      {followerMessage && (
        <Alert
          severity={followerMessage.type}
          onClose={() => setFollowerMessage(null)}
          sx={{ width: "100%", mb: 2 }}
        >
          {followerMessage.text}
        </Alert>
      )}

      <Box sx={{ width: "100%", marginBottom: "20px" }}>
        {followedUsers.length > 0 ? (
          followedUsers.map((followedUserId) => {
            const followedUser = users.find(
              (user) => user.id === followedUserId
            );
            if (!followedUser) return null;

            return (
              <Box
                key={followedUser.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  gap: 2,
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}
                >
                  <Avatar
                    src={followedUser.avatar}
                    alt={followedUser.username}
                    sx={{ width: 45, height: 45, marginRight: "10px" }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {followedUser.username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {followedUser.company?.catchPhrase ||
                        "No catchphrase available"}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ flexShrink: 0 }}
                  onClick={() => handleUnfollow(followedUser.id)}
                >
                  Unfollow
                </Button>
              </Box>
            );
          })
        ) : (
          <Typography variant="body2">No users to follow</Typography>
        )}
        <Divider sx={{ my: 2 }} />
      </Box>

      {currentUser && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: 2,
            marginBottom: "20px",
            width: "100%",
          }}
        >
          <Avatar
            src={currentUser.avatar}
            alt={currentUser.username}
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Box sx={{ flexGrow: 1, textAlign: "left" }}>
            <Typography variant="body1" fontWeight="bold">
              {currentUser.username}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {currentUser.company?.catchPhrase || "No catchphrase available"}
            </Typography>
          </Box>
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <TextField
          label="Update Status"
          size="small"
          variant="outlined"
          fullWidth
          value={newUserStatus}
          onChange={(e) => setNewUserStatus(e.target.value)}
          InputProps={{ sx: { height: "45px", padding: "0 10px" } }}
        />
        <Button
          variant="contained"
          size="small"
          sx={{ height: "45px" }}
          onClick={handleUpdateUserStatus}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default LeftBar;
