import React from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";

import default_avatar from "./default_avatar.jpg";
import SearchIcon from "@mui/icons-material/Search";

const SearchField = ({ placeholder, value, onChange }) => (
    <Paper
      component="form"
      onSubmit={(e) => e.preventDefault()} // 阻止默认表单提交行为
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
  
  const FollowingUser = ({ user, avatar, headline, onUnfollow }) => (
    <Box
      key={user}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
        <Avatar
          src={avatar || default_avatar}
          alt={user}
          sx={{ width: 45, height: 45, marginRight: "10px" }}
        />
        <Box>
          <Typography variant="body1" fontWeight="bold">
            {user}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {headline || "No headline available"}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="secondary"
        size="small"
        sx={{ flexShrink: 0 }}
        onClick={() => onUnfollow(user)}
      >
        Unfollow
      </Button>
    </Box>
  );

  export { SearchField };
  export default FollowingUser;