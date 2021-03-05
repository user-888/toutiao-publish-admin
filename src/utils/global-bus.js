// 全局通信总线
// 呼叫中心
// 作用可以在如何组件之间相互通信

import Vue from 'vue'

export default new Vue()

// 假设a组件要给b组件发送数据

// b 注册通信事件
// import globalBus from '@/utils/global-bus'
// globalBus-bus.$emit('自定义事件名称',() => {
//     // 处理函数
// })

// // a发布通信事件
// import globalBus from '@/utils/global-bus'
// globalBus-bus.$emit('自定义事件名称',() => {
//         // 处理函数

//     })

// 注意：通信的两端所使用的事件名称必须一致，否则是无效的
// 反之如果b要给a发送数据
// 那肯定就是a注册事件b发布
