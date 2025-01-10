import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticlesByUsername, createComment, updateArticle } from "../../store/articleSlice";
import { fetchFollowing } from "../../store/followingSlice";

const useMainBarLogic = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const username = currentUser ? currentUser.username : null;
  const followingUsers = useSelector((state) => state.following.followingUsers);
  const articles = useSelector((state) => state.articles.items);

  const [authorQuery, setAuthorQuery] = useState("");
  const [contentQuery, setContentQuery] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedText, setEditedText] = useState("");

  // Fetch following users
  useEffect(() => {
    if (username) {
      dispatch(fetchFollowing());
    }
  }, [username, dispatch]);

  // Fetch articles for current user and following users
  useEffect(() => {
    if (username && followingUsers.length > 0) {
      const uniqueUsers = [username, ...new Set(followingUsers)];
      uniqueUsers.forEach((user) => {
        dispatch(fetchArticlesByUsername(user));
      });
    }
  }, [username, followingUsers, dispatch]);

  // Filter articles
  const filteredPosts = articles
    .filter((article) => {
      const matchesAuthor =
        authorQuery.trim() === "" ||
        (article.author &&
          article.author.toLowerCase().includes(authorQuery.toLowerCase()));

      const matchesContent =
        contentQuery.trim() === "" ||
        (article.text &&
          article.text.toLowerCase().includes(contentQuery.toLowerCase()));

      return matchesAuthor && matchesContent;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleExpandClick = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const handleAddComment = (postId) => {
    if (newComment.trim()) {
      dispatch(createComment({ articleId: postId, text: newComment }));
      setNewComment("");
    }
  };

  const handleEditClick = (post) => {
    if (post.author === username) {
      setEditingPostId(post.pid);
      setEditedText(post.text);
      setEditDialogOpen(true);
    } else {
      console.log("You can only edit your own posts.");
    }
  };

  const handleEditSave = () => {
    if (editedText.trim() && editingPostId) {
      dispatch(updateArticle({ id: editingPostId, text: editedText }));
      setEditDialogOpen(false);
      setEditingPostId(null);
      setEditedText("");
    }
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
    setEditingPostId(null);
    setEditedText("");
  };

  return {
    username,
    authorQuery,
    setAuthorQuery,
    contentQuery,
    setContentQuery,
    filteredPosts,
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
  };
};

export default useMainBarLogic;
