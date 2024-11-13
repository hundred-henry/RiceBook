import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectFollowedUsersById } from "../features/userSlice";

export const useFilteredPosts = (initialUserId, authorQuery, contentQuery) => {
  const users = useSelector((state) => state.user.users);
  const followedUsers = useSelector(
    (state) => selectFollowedUsersById(state, initialUserId) || []
  );
  const postsWithImages = useSelector((state) => state.posts.posts);

  const filteredPosts = useMemo(() => {
    return postsWithImages
      .filter((post) => {
        // Check if contentQuery matches either the body or title of the post
        const matchesContent = 
          post.body.toLowerCase().includes(contentQuery.toLowerCase()) ||
          post.title.toLowerCase().includes(contentQuery.toLowerCase());

        const isFollowedUserOrSelf =
          post.userId === initialUserId ||
          (Array.isArray(followedUsers) && followedUsers.includes(post.userId));
          
        const matchesAuthor =
          authorQuery.trim() === ""
            ? true
            : users
                .find((user) => user.id === post.userId)
                ?.username.toLowerCase()
                .includes(authorQuery.toLowerCase());

        return matchesContent && isFollowedUserOrSelf && matchesAuthor;
      })
      .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
  }, [postsWithImages, contentQuery, followedUsers, authorQuery, initialUserId, users]);

  return filteredPosts;
};

export default useFilteredPosts;
