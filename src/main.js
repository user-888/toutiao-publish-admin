// 项目启动人口
import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 加载element组件库
import ElementUI from 'element-ui'

// 加载element组件库样式
import 'element-ui/lib/theme-chalk/index.css'

// 加载element全局样式文件
import './style/index.less'

// 全局注册element组件库
Vue.use(ElementUI)

// 全局注册element组件库
Vue.config.productionTip = false

// 创建vue根实例
// 把roouter配置到跟实例中
// 通过router方法把app跟组件渲染到#app入口节点
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
