<template>
    <!-- <div class="layout-container">
        <div>顶部导航栏</div> -->

        <!-- 子路由出口 -->
        <!-- <router-view></router-view>

        <div>侧边导航栏</div>
    </div> -->
    <el-container class="layout-container">
    <el-aside class="aside" width = "auto">
        <AppAside
        class="aside-menu"
        :is-collapse="isCollapse"
        />
    </el-aside>
    <el-container>
    <el-header class="header">
        <div>
            <i :class="{
                'el-icon-s-fold': isCollapse,
                'el-icon-s-unfold': !isCollapse
                }"
    @click="isCollapse = !isCollapse"
    ></i>
            <span>chen新闻发布</span>
        </div>
            <el-dropdown>
                <div class="avatar-wrap">
                    <img  class="avatar" :src="user.photo" alt="">
                    <span>{{ user.name}}</span>
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </div>
    <!-- <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
    </span> -->
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <!--  组件默认不识别原生事件，除非name做了处理 -->
        <el-dropdown-item
        @click.native="onLogout"

        >退出</el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
    </el-header>
    <el-main class="main">
        <!-- 子路由的出口 -->
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import AppAside from './componts/aside'
import { getUserProfile } from '@/api/user'
import globalBus from '@/utils/global-bus'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      user: {}, // 当用户登录信息
      isCollapse: false // 侧边菜单栏展开状态
    }
  },
  computed: {},
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()

    // 注册自定义事件
    // 只有当这个事件发布以后，这个注册函数才会被调用到
    globalBus.$on('update-user', (data) => {
      // 处理函数
      // console.log('update-user',data)
      // 注意不要this.user = data 这么做，对象之间赋值的是引用，会导致互相影响的问题
      // 我们不需要这么多数据，只有data，photo
      this.user.data = data.name
      this.user.photo = data.photo
    })
  },
  methods: {
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出吗', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户页面登录状态清除
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }

  },
  watch: {},
  mounted () {

  }
}
</script>

<style lang="less" scoped>
.layout-container {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
}
.aside {
    .aside-menu {
        height: 100%;
    }
}
    .aside {
        background: #d3dce6;
    }
    .header {
        // background: #b3c0d1;
        border-bottom: 1px solid #ccc;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .main {
        background: #e9eef3;
    }
    .avatar-wrap {
        display: flex;
        align-items: center;
        .avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }
</style>
