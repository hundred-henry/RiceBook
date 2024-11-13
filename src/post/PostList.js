import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const PostList = ({ posts, getUserById }) => {
  const [showComments, setShowComments] = useState({});

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {posts.map((post) => {
        const user = getUserById(post.userId);

        return (
          <Card
            key={post.id}
            sx={{
              boxShadow: 4,
              borderRadius: 3,
              overflow: "hidden",
              transition: "transform 0.3s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", position: "relative" }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }} src={user.avatar}>
                {user.username ? user.username.charAt(0) : "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Username: {user.username || "Unknown User"}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ position: "absolute", top: 0, right: 0, padding: "8px" }}
              >
                {new Date(post.timeStamp).toLocaleString()}
              </Typography>
            </CardContent>

            {post.imageUrl && (
              <Box sx={{ textAlign: "center", padding: 2 }}>
                <img
                  src={post.imageUrl}
                  alt={`Post by ${user.username}`}
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            )}

            <Divider />

            {/* Post Body Styling */}
            <CardContent>
              <Box
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: 2,
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Typography variant="body1" color="text.primary">
                  {post.body}
                </Typography>
              </Box>

              {/* Centered Toggle Comments Button */}
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => toggleComments(post.id)}
                >
                  {showComments[post.id] ? "Hide Comments" : "Show Comments"}
                </Button>
              </Box>

              {/* Display Comments Section */}
              {showComments[post.id] && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Comments:
                  </Typography>
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <Box
                        key={comment.id}
                        sx={{
                          mb: 2,
                          pl: 2,
                          pr: 2,
                          pt: 1,
                          pb: 1,
                          backgroundColor: "#f9f9f9",
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.primary" sx={{ fontWeight: "bold" }}>
                          {comment.name} ({comment.email})
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1, mb: 1, lineHeight: 1.5 }}
                        >
                          {comment.body}
                        </Typography>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No comments yet.
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>

            <CardActions sx={{ display: "flex", justifyContent: "flex-end", px: 2 }}>
              <Button size="small" color="primary">
                Comment
              </Button>
              <Button size="small" color="secondary">
                Edit
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
};

export default PostList;
