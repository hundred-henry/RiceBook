import { configureStore } from '@reduxjs/toolkit';
import userReducer from './store/userSlice';
import followingSlice from "./store/followingSlice";
import profileSlice from "./store/profileSlice";
import articleReducer from './store/articleSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 使用 localStorage

// 配置持久化
const persistConfig = {
  key: 'user', // 持久化 user 状态
  storage,
  whitelist: ['currentUser', 'isLoggedIn'], // 持久化的字段
};

// 包装 userReducer 来处理持久化
const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer, // 持久化的 user 状态
    articles: articleReducer, // 文章状态
    profile: profileSlice, // 用户资料状态
    following: followingSlice, // 关注状态
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
