// api
import axios from 'axios';
import { showMessage } from "../untils/status"; // 引入状态码文件
import { ElMessage, ElMessageBox } from "element-plus"; // 引入el 提示框
// 定义baseURL
export const baseURL = 'http://39.106.69.15:8081';

// 创建 axios 实例
export const request = axios.create({
  baseURL,
  timeout: 60000, // 设置请求超时
});
const token = () => {
  if (sessionStorage.getItem("token")) {
    return sessionStorage.getItem("token");
  } else {
    return sessionStorage.getItem("token");
  }
};

//请求拦截
axios.interceptors.request.use(
  (config) => {
    // 配置请求头
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
    config.headers["token"] = token();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
request.interceptors.response.use(
  (response) => {
    // 检查后端的自定义业务状态码
    const { code } = response.data;
    if (code && code !== 200) {
      showMessage(code);
      return Promise.reject(new Error(response.data.message || '业务逻辑错误'));
    }
    return response;
  },
  (error) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      // showMessage(response.status); // 传入响应码，匹配响应码对应信息
      ElMessageBox.alert(response.data.message);
      return Promise.reject(response.data);
    } else {
      ElMessage.warning("网络连接异常,请稍后再试!");
    }
  }
);


export interface Applicant {
  userId: number;
  college: string;
  major: string;
  className: string;
  direction: number;
  name: string;
  studentId: string;
  phone: string;
  introduction: string;
  avatar: string;
  stageId: number;
  stageName: string;
  out: boolean;
}