import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { showMessage } from "./status"; // 引入状态码文件
import { ElMessageBox } from 'element-plus'
 const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://39.106.69.15:8081/',
  timeout: 40000,
}); 
export default axiosInstance
//请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if(token){
    // 配置请求头
      config.headers["Content-Type"] = "application/json;charset=UTF-8"
      config.headers["Authorization"] = token
    }
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
);

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    // 检查后端的自定义业务状态码
    const { code } = response.data;
    
    if (code && code !== 200) {  // 假设 200 是成功的业务状态码，其他值代表错误
      showMessage(code); // 根据业务状态码显示相应的错误消息
      return Promise.reject(response.data);  // 返回错误信息
    }
    return response;
  },
  (error: { response: any; }) => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      showMessage(response.status) // 传入响应码，匹配响应码对应信息
      return Promise.reject(response.data)
    } else {
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
        if ((res.data as resData<T>).code >= 200 && (res.data as resData<T>).code < 300) {
          resolve((res.data as resData<T>).data)
        } else if (res.data.data.hasOwnProperty('startTime')) {
          console.log(showMessage(res.status))
          reject(res.data.data.startTime)
        } else if ((res.data as resData<T>).code == 401) { 
          console.log(showMessage(res.status))
          if (localStorage.getItem('token')) {
           localStorage.removeItem('token')
          }
          reject('token已过期，请重新登录')
        } else {
          console.log(showMessage(res.status))
          reject('网络错误')
        }
      })
     .catch((err) => {
        console.log(err)
        console.log(showMessage(err.status))
        reject('网络错误')
      })
  })
}

export function dealEor(err:any) {
  if (err == 'token已过期，请重新登录') {
    ElMessageBox.alert(`${err}`, {
      callback() {
        location.reload()
      }
    })
  } else {
    ElMessageBox.alert(`${err}`)
  }
}