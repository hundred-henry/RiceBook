import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../features/postSlice";

const RightBar = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId); // Get the current user's ID from Redux

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleAddPost = () => {
    if (title && content) {
      const newPost = {
        id: Date.now(), // 使用时间戳作为唯一 ID
        title,
        body: content,
        userId, // Attach the current userId to the post
        image, // Assuming image will be handled in your slice
        timeStamp: new Date().toISOString(), // 添加时间戳
      };

      dispatch(addPost(newPost)); // Dispatch the action to add the post

      // Reset the form fields after submission
      clearForm();
    }
  };

  // Function to clear the form fields
  const clearForm = () => {
    setTitle("");
    setContent("");
    setImage(null);
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          fontSize: "24px",
          color: "primary.main",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        Add Post
      </Typography>

      {/* Post title input */}
      <TextField
        label="Post Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Image upload button */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
        <Button variant="contained" component="label">
          Upload Image
          <input
            type="file"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />
        </Button>
      </Box>

      {/* Post content input */}
      <TextField
        label="Post Content"
        fullWidth
        multiline
        rows={8}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {/* Submit post and Clear buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAddPost}>
          Add Post
        </Button>
        <Button variant="outlined" color="secondary" onClick={clearForm}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default RightBar;
