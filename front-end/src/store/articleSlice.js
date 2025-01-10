import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/api"; // 使用封装的 Axios 实例

// 异步 Thunk：创建新文章
export const createArticle = createAsyncThunk(
  "articles/createArticle",
  async (articleData, { rejectWithValue }) => {
    try {
      const response = await api.post("/article", articleData);
      return response.articles[0]; // 返回创建的文章对象
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create article"
      );
    }
  }
);

// 还原的 fetchArticles 函数
export const fetchArticles = createAsyncThunk(
  "articles/fetchArticles",
  async (id = null, { rejectWithValue }) => {
    try {
      const endpoint = id
        ? `/articles/${id}` // Fetch a specific article by ID
        : `/articles`; // Fetch articles for the logged-in user
      const response = await api.get(endpoint);
      return response.articles; // Assume backend returns `{ articles: [...] }`
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch articles"
      );
    }
  }
);

// 根据 username 获取文章列表
export const fetchArticlesByUsername = createAsyncThunk(
  "articles/fetchArticlesByUsername",
  async (username, { rejectWithValue }) => {
    try {
      const response = await api.get(`/articles/user/${username}`);
      return response.articles; // 假设后端返回的数据中有 articles 列表
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch user articles"
      );
    }
  }
);

// 异步 Thunk：更新文章
export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async ({ id, text, commentId }, { rejectWithValue }) => {
    try {
      const requestBody = { text };
      if (commentId !== undefined) {
        requestBody.commentId = commentId;
      }
      const response = await api.put(`/articles/${id}`, requestBody);
      return response.articles[0]; // 返回更新后的文章对象
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update article"
      );
    }
  }
);

// 异步 Thunk：创建新评论
export const createComment = createAsyncThunk(
  "articles/createComment",
  async ({ articleId, text }, { rejectWithValue }) => {
    try {
      const requestBody = { text, commentId: -1 }; // -1 表示添加新评论
      const response = await api.put(`/articles/${articleId}`, requestBody);
      return response.articles[0]; // 返回更新后的文章对象
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create comment"
      );
    }
  }
);

// 异步 Thunk：更新评论
export const updateComment = createAsyncThunk(
  "articles/updateComment",
  async ({ articleId, commentId, text }, { rejectWithValue }) => {
    try {
      const requestBody = { text, commentId };
      const response = await api.put(`/articles/${articleId}`, requestBody);
      return response.articles[0]; // 返回更新后的文章对象
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update comment"
      );
    }
  }
);

// 定义文章 Slice
const articleSlice = createSlice({
  name: "articles",
  initialState: {
    items: [], // 存储文章列表
    loading: false, // 表示是否正在加载
    error: null, // 错误信息
  },
  reducers: {
    // 本地添加新文章（仅客户端）
    addLocalArticle(state, action) {
      state.items.unshift(action.payload);
    },
    // 重置文章状态
    resetArticlesState(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 创建新文章
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); // 将新文章添加到列表顶部
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 获取文章列表
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload; // Update the articles list
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 获取用户文章列表
      .addCase(fetchArticlesByUsername.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticlesByUsername.fulfilled, (state, action) => {
        const newArticles = action.payload; // 新获取的文章
        const mergedArticles = [...state.items, ...newArticles]; // 合并现有文章和新文章

        // 根据文章 ID 去重
        state.items = Array.from(
          new Map(
            mergedArticles.map((article) => [article.pid, article])
          ).values()
        );

        // 按日期排序
        state.items.sort((a, b) => new Date(b.date) - new Date(a.date));
      })
      .addCase(fetchArticlesByUsername.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 更新文章
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (article) => article.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // 更新对应的文章内容
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 创建新评论
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (article) => article.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // 更新文章，包含新评论
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 更新评论
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (article) => article.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // 更新文章，包含更新后的评论
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// 导出 Actions 和 Reducer
export const { addLocalArticle, resetArticlesState } = articleSlice.actions;
export default articleSlice.reducer;
