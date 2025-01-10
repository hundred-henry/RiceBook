import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import useRightBarLogic from "./RightBarLogic";

const RightBar = () => {
  const {
    title,
    setTitle,
    content,
    setContent,
    setImage,
    handleAddPost,
    clearForm,
  } = useRightBarLogic();

  const [imagePreview, setImagePreview] = useState(null); // 用于存储图片预览

  // 处理图片上传和预览
  const handleImageUpload = (event) => {
    const file = event.target.files[0]; // 获取上传的文件
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // 设置图片预览
        setImage(file); // 保存图片文件
      };
      reader.readAsDataURL(file); // 读取图片文件并转换为 URL
    }
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
            onChange={handleImageUpload}
            accept="image/*" // 限制只允许图片上传
          />
        </Button>
      </Box>

      {/* 显示图片预览区域 */}
      {imagePreview && (
        <Box sx={{ textAlign: "center", marginBottom: 2 }}>
          <Typography variant="body1" sx={{ marginBottom: 1 }}>
            Image Preview:
          </Typography>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: "100%",
              maxWidth: "300px", // 最大宽度300px
              borderRadius: "8px",
              objectFit: "cover", // 保持图片比例
            }}
          />
        </Box>
      )}

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
