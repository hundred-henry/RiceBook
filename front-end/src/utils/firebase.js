import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// 替换为您的 Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyCcCqn8PSGfuGedbiB1_RtTJPL54CTgdHk",
  authDomain: "ricebook-9840a.firebaseapp.com",
  projectId: "ricebook-9840a",
  storageBucket: "ricebook-9840a.firebasestorage.app",
  messagingSenderId: "161943881573",
  appId: "1:161943881573:web:94252e1c5f7d496729838c",
  measurementId: "G-0E455DYKZF"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Firebase Storage
export const storage = getStorage(app);