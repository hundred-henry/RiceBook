// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import postsReducer from './features/postSlice';
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

// 配置持久化，仅持久化 userId
const persistConfig = {
  key: 'userId',
  storage,
  whitelist: ['userId'], // 只持久化 userId
};

// 包装 userReducer 来处理持久化的 userId
const persistedUserIdReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedUserIdReducer, // 持久化的 userId
    posts: postsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);
export {store, persistor};
