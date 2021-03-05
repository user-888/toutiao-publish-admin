import Vue from 'vue'
import VueRouter from 'vue-router'

// 在vuecli创建的项目中@表示src的目录
// 他是src的别名
// 好处：它不受当前文件的路径影响
// 注意@就是src的路径，后面别忘了写那个斜杠
// 使用建议  凡是加载的资源在当前目录下，那就正常写 如果需要进行父级路径查找的都使用@
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article/'
import Publish from '@/views/publish/'
import Image from '@/views/image/'
import Comment from '@/views/comment/'
import Settings from '@/views/settings/'
import Fans from '@/views/fans/'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由layout已有一个默认子路由，这个名字没有意义
    // 正确的做法是，如果有默认子路由，就不要给父路由起名
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path  为空会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/Image',
        name: 'Image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      },
      {
        path: '/fans',
        name: 'fans',
        component: Fans
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 路由导航守卫，说白了就是所有的野米安导航都会经过这里
// beforeEach是全局前置守卫，任何页面访问都要经过这里
// 路由导航守卫(拦截器)的作用就是控制页面访问状态
// 守卫也米娜的导航
// to  要去的路由信息
// from  来自哪里的路由信息
// next:放行方法

// 校验非登录页面的登录状态
router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))

  if (to.path !== '/login') {
    if (user) {
      next()
    } else {
      // 没有登录跳转回首页
      next('login')
    }
  } else {
    // 允许通过
    next()
  }
})
// 我们在组件中使用的this.$router 其实就是这个模块的router
export default router
