// 基于axiso 封装请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'

// 非组件模块可以这样加载使用element的message提示组件
import { Message } from 'element-ui'

/// 创建一个 axios 实例，说白了就是复制了一个 axios
// 我们通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/', // 请求的基础路径

  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据（未经处理的 JSON 格式字符串）
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    // console.log(data)

    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      // console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(
  // 所以请求会经过·这里
  // config是当前请求相关的配置信息对象
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // Authorization: `Bearer ${user.token}`

    // console.log(config);

    // 然后我们就可以在容许请求出去之前定制统一业务功能处理
    // 例如：统一的设置token

    // 当这里 return config 之后请求再会真正的发出去，不然进不去
    return config
  },
  // 所有请求失败，会经过·这里
  function (error) {
    return Promise.reject(error)
  })

// 响应拦截器
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // 任何处于2xx范围内的状态代码都会导致该函数触发  响应成功到这里
  // //使用响应数据
  // 注意：一定要把响应结果return ，否则真正发请求的位置拿不到数据

  return response
}, function (error) {
  const { status } = error.response
  // 任何超出此范围的状态代码的2XX原因此功能可触发
  if (status === 401) {
    // 跳转到登录页面
    // 清除本地存储中的用户登录状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message('登录状态无效，请重新登录')
  } else if (status === 403) {
    // token未携带或已过期
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status === 400) {
    // 没有操作权限
    Message.error('请求参数错误，请检查参数')
  } else if (status >= 500) {
    // 服务端错误
    Message.error('服务端内部异常，请稍后重试')
  }

  // 做一些与响应错误
  return Promise.reject(error)
})

// 导出请求方法
export default request

// 谁要使用就加载request模块
// import request from 'request.js'
// request.xxx
// request({
//     method: ,
//     url: ''
// })
