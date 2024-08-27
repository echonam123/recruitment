interface Data<T>{
  statusCode: string,
  msg: string,
  data:T
}

//封装http请求
export const http = <T>(options:UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      //请求成功
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          //成功
          resolve(res.data as Data<T>)//string是规范result数据类型的
        } else if (res.statusCode == 401) {//token失效，登录错误
          //清理用户信息，跳转登录页
          reject(res)
        } else {
          //其他错误
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求失败'
          })
          reject(res)
        }
      },
      //响应失败
      fail(err) {
        uni.showToast({
          icon: 'none',
          title:'网络错误'
        })
        reject(err)
      }
    })
  })
}

//拦截器


