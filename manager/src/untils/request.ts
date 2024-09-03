import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { showMessage } from "./status"; // 引入状态码文件
 const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://39.106.69.15:8081/',
  timeout: 40000,
}); 
export default axiosInstance
//请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if(token){
    // 配置请求头
      config.headers["Content-Type"] = "application/json;charset=UTF-8";
      config.headers["Authorization"] = 'Bearer'+ token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
axiosInstance.interceptors.response.use(
  (response:AxiosResponse) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status); // 传入响应码，匹配响应码对应信息
      return Promise.reject(response.data);
    } else {
      console.log(error)
      
      alert("网络连接异常,请稍后再试!")
    }
  }
);
interface resData<T>{
  code: number,
  message: string,
  data:T
}
export function request<T>(data: any) {
  return new Promise<T>((resolve, reject) => {
   axiosInstance(data)
      .then((res: AxiosResponse) => {
        if ((res.data as resData<T>).code >= 200 && (res.data as resData<T>).code<300) {
          resolve((res.data as resData<T>).data)
        } else {
          reject(res.data.message)
        }
      })
      .catch((err) => {
        reject(err)
      });
  });
}