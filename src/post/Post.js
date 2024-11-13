import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import SearchField from "./SearchField";
import PostList from "./PostList";
import { useFilteredPosts } from "./useFilteredPosts";

const Post = () => {
  const initialUserId = useSelector((state) => state.user.userId);
  const [authorQuery, setAuthorQuery] = useState("");
  const [contentQuery, setContentQuery] = useState("");

  const users = useSelector((state) => state.user.users);
  const filteredPosts = useFilteredPosts(
    initialUserId,
    authorQuery,
    contentQuery
  );

  const getUserById = (userId) => {
    return users.find((user) => user.id === userId) || {};
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 3,
          gap: 2,
        }}
      >
        <SearchField
          placeholder="Search by Author..."
          value={authorQuery}
          onChange={(e) => setAuthorQuery(e.target.value)}
        />
        <SearchField
          placeholder="Search by post content..."
          value={contentQuery}
          onChange={(e) => setContentQuery(e.target.value)}
        />
      </Box>

      <Typography
        variant="h5"
        component="div"
        sx={{
          marginBottom: 2,
          textAlign: "center",
          fontWeight: "bold",
          color: "primary.main",
        }}
      >
        Posts
      </Typography>

      <PostList posts={filteredPosts} getUserById={getUserById} />
    </Box>
  );
};

export default Post;
