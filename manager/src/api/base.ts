// api
import axios from 'axios';

// 定义baseURL
export const baseURL = 'https://39.106.69.15:8081';

// 创建 axios 实例
export const request = axios.create({
  baseURL,
  timeout: 10000, // 设置请求超时
});