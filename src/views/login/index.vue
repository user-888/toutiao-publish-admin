<template>
    <div class="login-container">
        <!-- el-form 表单组件 每项都必须使用el-form-item组件包裹 -->
        <img src="./2.png" alt="">
        <!-- 配置form 表单验证
        1、必须给 el-form 组件绑定 model为表数据对象
        2、给需要验证的表单项el-form-tiem绑定prop属性
        注意：prop属性需要指定表单对象中数据的名称
        3、通过el-from组件的rules属性配置的验证规则

        手动触发表单验证：
        1、给el-form设置ref起个名字(随便起名，不要重复即可)
        2、通过ref获el-form组件，调用组件的validate进行验证
        -->
        <el-form class="logo-from" ref="login-form" :rules="formRules" :model="user" >
    <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
    </el-form-item>
    <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
    </el-form-item>
    <el-form-item  prop="agree">
      <el-checkbox v-model="user.agree">我已阅读并同意用户协议和隐私条款</el-checkbox>
    </el-form-item>
    <el-form-item>
        <el-button  class="logo-btn" type="primary" @click="onlogin" :loading="loginloading">登录</el-button>
    </el-form-item>
    </el-form>
    </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIdext',
  data () {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
        agree: false
      },
      // checked: false , // 是否同意协议选中状态
      loginloading: false,
      formRules: {
        // 需要验证的数据名称： 规则列表[]
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式', trigger: 'change' }
        ],
        agree: [
          {
            // 自定义校验规则
            // 如果验证通过：callback()
            // 如果验证失败：callback(new Error('错误信息'))
            validator: (rule, value, callback) => {
              if (value) {
                callback()
              } else {
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onlogin () {
      // 处理表单数据 ( 根据接口要求绑定数据 )
      // const user = this.user

      // 表单验证
      // validate 是异步的
      this.$refs['login-form'].validate(valid => {
      // 如果表单验证失败，停止请求提交
        if (!valid) {
          return
        }
        // 表单验证通过，请求登录
        this.login()
      })
    },
    login () {
      // 开启登陆中  loading....
      this.loginloading = true
      // 对于代码中的请求操作
      // 1、接口请求可能需要重用
      // 2、实际工作中，接口非常容易变动，改起来麻烦
      // 3、我们建议的做法是把所有的请求都封装成函数然后统一整理
      // 这样做的好处是管理维护容易，也好重用
      login(this.user).then(res => {
        console.log(res)
        // 成功xxx
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 关闭loading
        this.loginloading = false

        // 将接口返回拥护相关数据放到本地存储，方便应用数据共享
        // 本地存储只能存储字符串
        // 如果需要存储对象、数组类型的数据，则把他们转为json格式进行存储
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 这方法语义更强  跳转到首页  或者this.$router.push('/')
        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)
        // 失败xxx
        this.$message.error('登录失败，手机号或者验证码错误')
        // 关闭loading
        this.loginloading = false
      })
      // 处理后端响应结果
    }
  }
}
</script>

<style lang="less" scoped>
    .login-container{
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: url("./logo.jpg") no-repeat;
        z-index: 0;
        background-size: cover;

          img{
            width: 300px;
            height: 57px;
            z-index: 100;}

        .logo-from {
            background: #fff;
          min-width: 300px;
          padding: 50px;
          .logo-btn{
              width: 100%;
          }
        }
    }
</style>
