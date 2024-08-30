interface Data<T>{
  statusCode: string,
  msg: string,
  data:T
}

//封装http请求
export const http = <T>(options:UniApp.RequestOptions) => {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      //请求成功
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          //成功
          resolve(res.data as T)//string是规范result数据类型的
        } else if (res.statusCode == 401) {//token失效，登录错误
          //清理用户信息，跳转登录页
          uni.showModal({
              title: '提示',
              content: '您尚未登录，是否登录？',
              success: function(res) {
                  if (res.confirm) {
                      uni.navigateTo({
                          url: 'pages/myth/myth',
                      });
                  }
              }
            });
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
const baseUrl = 'https://39.106.69.15:8081'
const httpInterceptor = {
  //拦截前触发
  invoke(options) {
    // 非http开头拼接url
    if (!options.url.startsWith('http')) {
      options.url = baseUrl+options.url
    }
    
    //请求超时，默认为60s
    options.timeout = 10000
    //添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source-client':'mini-app'  //miniapp代表小程序端，app代表app端
    }
    //添加token请求头
    const token = uni.getStorageSync('token')
    if (token) {
      options.header.Authorization = token
    }
  }
}
uni.addInterceptor('request', httpInterceptor)

