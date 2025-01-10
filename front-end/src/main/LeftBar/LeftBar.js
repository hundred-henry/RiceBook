import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  TextField,
  Divider,
  Alert,
} from "@mui/material";

import LeftBarLogic from "./LeftBarLogic";
import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import default_avatar from "./default_avatar.jpg";
import FollowingUser from "./LeftBarComponent";
import { SearchField } from "./LeftBarComponent";

const LeftBar = () => {
  const navigate = useNavigate();
  const {
    username,
    headline,
    avatar,
    followingUsers,
    followingUserAvatars,
    followingUserHeadlines,
    newFollower,
    setNewFollower,
    newUserHeadline,
    setNewUserHeadline,
    followerMessage,
    setFollowerMessage,
    handleLogout,
    handleAddFollower,
    handleUnfollow,
    handleUpdateUserHeadline,
  } = LeftBarLogic();

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
      {/* Header Section */}
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

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          marginBottom: "20px",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate(`/profile/${username}`)}
        >
          Profile
        </Button>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Following Section */}
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

      {/* Search and Add Follower */}
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

      {/* Follower Message Alert */}
      {followerMessage && (
        <Alert
          severity={followerMessage.type}
          onClose={() => setFollowerMessage(null)}
          sx={{ width: "100%", mb: 2 }}
        >
          {followerMessage.text}
        </Alert>
      )}

      {/* List of Following Users */}
      <Box sx={{ width: "100%", marginBottom: "20px" }}>
        {followingUsers?.length > 0 ? (
          followingUsers.map((user) => (
            <FollowingUser
              key={user}
              user={user}
              avatar={followingUserAvatars[user]}
              headline={followingUserHeadlines[user]}
              onUnfollow={handleUnfollow}
            />
          ))
        ) : (
          <Typography variant="body2">No users to follow</Typography>
        )}
        <Divider sx={{ my: 2 }} />
      </Box>

      {/* User Info Section */}
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
          src={avatar || default_avatar}
          alt={username}
          sx={{ width: 50, height: 50, mr: 2 }}
        />
        <Box sx={{ flexGrow: 1, textAlign: "left" }}>
          <Typography variant="body1" fontWeight="bold">
            {username}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {headline || "No headline available"}
          </Typography>
        </Box>
      </Box>

      {/* Update User Headline Section */}
      <Box sx={{ display: "flex", gap: 2, marginTop: 2 }}>
        <TextField
          label="Update Headline"
          size="small"
          variant="outlined"
          fullWidth
          value={newUserHeadline}
          onChange={(e) => setNewUserHeadline(e.target.value)}
          InputProps={{ sx: { height: "45px", padding: "0 10px" } }}
        />
        <Button
          variant="contained"
          size="small"
          sx={{ height: "45px" }}
          onClick={handleUpdateUserHeadline}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default LeftBar;
