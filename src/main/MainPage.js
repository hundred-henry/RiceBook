import React, { useEffect, useState } from "react";
import { Grid, Box, Paper, Typography } from "@mui/material"; // MUI 组件
import Post from "../post/Post";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
// redux
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../features/postSlice";

const MainPage = () => {
  const [searchQuery, setSearchQuery] = useState(""); // 搜索输入框的值
  const dispatch = useDispatch();

  // 从 Redux 获取 userId 和 posts
  const userId = useSelector((state) => state.user.userId);
  const { posts, status, error } = useSelector((state) => state.posts);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts()); // 获取帖子数据
    }
  }, [dispatch, status]);

  // 处理搜索输入框变化
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // 根据 userId 和搜索框输入内容进行帖子过滤
  const filteredPosts = posts
    .filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((post) =>
      userId ? post.userId.toString() === userId.toString() : true
    );

  // 处理加载状态和错误
  if (status === "loading") {
    return <Typography variant="h6">Loading posts...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{`Error: ${error}`}</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        {/* 左侧栏 */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <LeftBar />
          </Paper>
        </Grid>

        {/* 中间内容 */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            {filteredPosts.length > 0 ? (
              <Post
                posts={filteredPosts}
                searchQuery={searchQuery}
                userId={userId}
                handleSearchQueryChange={handleSearchQueryChange}
              />
            ) : (
              <Typography variant="h6" align="center">
                No posts available.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* 右侧栏 */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <RightBar />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainPage;
