// Import necessary functions from Redux Toolkit
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define timestamp list and image data arrays for adding metadata to posts
const timeStampList = [
  "2024-10-19 06:54:04",
  "2024-10-18 15:04:01",
  "2024-10-17 14:27:35",
  "2024-10-16 12:58:26",
  "2024-10-15 01:51:43",
  "2024-10-14 17:43:19",
  "2024-10-13 16:43:01",
  "2024-10-12 17:06:41",
  "2024-10-11 22:27:04",
  "2024-10-10 16:15:35",
];

const imageData = [
  {
    id: 1,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP9JDbMwrovPri0M29Iz4bIEbCIqNmZyP7W07PQvqJ-doDcmSAxIqqk4A1-XEewqZHkL4&usqp=CAU",
  },
  {
    id: 2,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBWKigz068w797kzODNMFufeprkzi4RAjdbQ&s",
  },
  {
    id: 3,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFR98ZE2VfL5-LYxh-UBukh27DBnvQuY2zctRunXaAjEuTwZ5BqXT-KeojXAgHFaU_1_w&usqp=CAU",
  },
  {
    id: 4,
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWtCEkYtv52q4D_m8EFYM-ccbv0KiZybkAuQEaivW_Z9ANYxLE40NVM8uICn1uG_YPFvs&usqp=CAU",
  },
];

// Combined async function to fetch posts and bind comments
const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (followedUserIds = null) => {
    // Fetch posts and comments concurrently
    const [postsResponse, commentsResponse] = await Promise.all([
      fetch("https://jsonplaceholder.typicode.com/posts"),
      fetch("https://jsonplaceholder.typicode.com/comments"),
    ]);

    const allPosts = await postsResponse.json();
    const allComments = await commentsResponse.json();

    // Filter posts if followedUserIds is provided, otherwise include all posts
    const filteredPosts = followedUserIds
      ? allPosts.filter((post) => followedUserIds.includes(post.userId))
      : allPosts;

    // Track how many posts each user has processed
    const userPostCounts = {};

    // Bind comments to posts and add metadata
    const postsWithMetadata = filteredPosts.map((post, index) => {
      const postComments = allComments.filter(
        (comment) => comment.postId === post.id
      );

      // Initialize the user's post count if not already done
      if (!userPostCounts[post.userId]) {
        userPostCounts[post.userId] = 0;
      }

      // Determine if this post should have an image based on user's post count
      const imageUrl =
        userPostCounts[post.userId] < 4
          ? imageData[userPostCounts[post.userId] % imageData.length]?.url
          : null;

      // Increment the user's post count
      userPostCounts[post.userId]++;

      return {
        ...post,
        timeStamp: new Date(timeStampList[index % timeStampList.length]),
        imageUrl, // Only first 4 posts for each user get an image
        comments: postComments, // Bind relevant comments to each post
      };
    });

    return postsWithMetadata;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addPost: (state, action) => {
      const newPostTimeStamp = new Date(action.payload.timeStamp);
      const insertAt = state.posts.findIndex(
        (post) => new Date(post.timeStamp) < newPostTimeStamp
      );

      if (insertAt === -1) {
        state.posts.push(action.payload);
      } else {
        state.posts.splice(insertAt, 0, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addPost } = postsSlice.actions;
export default postsSlice.reducer;
export { fetchPosts };
