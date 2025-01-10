// src/utils/api.js
import axios from 'axios';

// 配置后端 API 基础路径
export const API_BASE_URL = 'https://ricebook-hw88-bca234b45bd7.herokuapp.com';

// 创建 Axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 请求超时限制（可选）
  withCredentials: true, // 允许发送 Cookie
});

// 请求拦截器（可选）：在请求前添加认证信息
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 响应拦截器（可选）：统一处理错误或格式化响应
api.interceptors.response.use(
  (response) => response.data, // 默认返回 data 字段
  (error) => Promise.reject(error)
);

export default api;
