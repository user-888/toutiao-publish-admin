// 用户相关请求模块
import request from '@/utils/request'
// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/authorizations',
    // data用来设置post请求体 data：data相当于
    data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  // const user = JSON.parse(window.localStorage.getItem('user'))

  return request({
    method: 'GET',
    url: '/mp/v1_0/user/profile'
    // 后端要求把需要授权的用户身份放在请求头中
    // axios 可以通过header选项设置请求头
    // headers: {
    //   // 属性名和值都得看接口的请求
    //   // 属性名：Authorization。接口要求的
    //   // 属性值： Bearer空格token数据
    //   // bearer 持票人
    //   Authorization: `Bearer ${user.token}`
    // }
  })
}

// 修改用户信息
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/profile',
    data
  })
}

// 修改用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/mp/v1_0/user/photo',
    data
  })
}
