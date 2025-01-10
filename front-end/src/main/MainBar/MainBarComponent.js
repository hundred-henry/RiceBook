import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  InputBase,
  Collapse,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CommentIcon from "@mui/icons-material/Comment";
import EditIcon from "@mui/icons-material/Edit";
import useMainBarLogic from "../MainBar/MainBarLogic";

const SearchField = ({ placeholder, value, onChange }) => (
  <Paper
    component="form"
    sx={{
      display: "flex",
      alignItems: "center",
      padding: "4px 10px",
      flexGrow: 1,
      borderRadius: 3,
      boxShadow: 2,
    }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder={placeholder}
      inputProps={{ "aria-label": placeholder }}
      value={value}
      onChange={onChange}
    />
    <IconButton type="button" sx={{ p: "10px" }}>
      <SearchIcon />
    </IconButton>
  </Paper>
);

const PostList = ({ posts, currentUsername }) => {
  const {
    expandedPostId,
    newComment,
    editDialogOpen,
    editedText,
    handleExpandClick,
    handleAddComment,
    handleEditClick,
    handleEditSave,
    handleEditCancel,
    setNewComment,
    setEditedText,
  } = useMainBarLogic({ currentUsername });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {posts.map((post) => (
        <Card
          key={post.pid}
          sx={{
            boxShadow: 3,
            borderRadius: 3,
            borderColor: "primary.main",
            borderWidth: 2,
            borderStyle: "solid",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              {post.title}
            </Typography>

            {post.image && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 400, height: 300, objectFit: "cover" }}
                  image={post.image}
                  alt={post.title}
                />
              </Box>
            )}
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ marginBottom: 2 }}
            >
              {post.text}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="caption" color="primary.main">
                Author: {post.author}
              </Typography>
              <Box>
                <IconButton onClick={() => handleExpandClick(post.pid)}>
                  <CommentIcon />
                </IconButton>
                <IconButton onClick={() => handleEditClick(post)}>
                  <EditIcon />
                </IconButton>
              </Box>
            </Box>
            <Collapse
              in={expandedPostId === post.pid}
              timeout="auto"
              unmountOnExit
            >
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" color="primary.main">
                  Comments:
                </Typography>
                {post.comments && post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <Box key={comment.commentId} sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {comment.author} (
                        {new Date(comment.date).toLocaleString()}):
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {comment.text}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    No comments yet.
                  </Typography>
                )}
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}
                >
                  <TextField
                    label="Add a comment"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddComment(post.pid)}
                  >
                    Post
                  </Button>
                </Box>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}

      {/* Edit Article Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditCancel}>
        <DialogTitle>Edit Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Edit your article content below:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Article Content"
            type="text"
            fullWidth
            multiline
            minRows={4}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostList;
export { SearchField };
