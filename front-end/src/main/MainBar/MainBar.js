import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import useMainBarLogic from "./MainBarLogic.js";
import PostList from "./MainBarComponent.js"; // Updated import for PostList
import { SearchField } from "./MainBarComponent.js"; // Updated import for SearchField
import Pagination from "@mui/material/Pagination"; // Import Pagination

const MainBar = () => {
  const {
    username,
    authorQuery,
    setAuthorQuery,
    contentQuery,
    setContentQuery,
    filteredPosts,
    handleExpandClick,
    handleAddComment,
    handleEditClick,
    handleEditSave,
    handleEditCancel,
    editDialogOpen,
    editedText,
    setEditedText,
    expandedPostId,
    newComment,
    setNewComment,
  } = useMainBarLogic(); // Use the logic hook to manage all business logic

  // Manage page number state
  const [page, setPage] = useState(1);

  // Items per page
  const itemsPerPage = 10;

  // Calculate the current posts to be displayed based on the page
  const currentPosts = filteredPosts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
      {/* Search Fields */}
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

      {/* Title */}
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

      {/* Post List */}
      {filteredPosts && filteredPosts.length > 0 ? (
        <>
          <PostList
            posts={currentPosts}  // Display only current page's posts
            username={username}
            handleExpandClick={handleExpandClick}
            handleAddComment={handleAddComment}
            handleEditClick={handleEditClick}
            handleEditSave={handleEditSave}
            handleEditCancel={handleEditCancel}
            editDialogOpen={editDialogOpen}
            editedText={editedText}
            setEditedText={setEditedText}
            expandedPostId={expandedPostId}
            newComment={newComment}
            setNewComment={setNewComment}
          />
          {/* Pagination Component */}
          <Pagination
            count={Math.ceil(filteredPosts.length / itemsPerPage)}  // Calculate total number of pages
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}
          />
        </>
      ) : (
        <Typography variant="body2" align="center">
          No posts available.
        </Typography>
      )}
    </Box>
  );
};

export default MainBar;
