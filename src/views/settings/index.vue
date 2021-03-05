<template>
    <div class="settings-container">
         <el-card class="box-card">
    <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- /面包屑导航 -->
    </div>

        <el-row>
            <el-col :span="15">
            <el-form ref="form" :model="user" label-width="70px">
    <el-form-item label="编号">
        {{user.id}}
    </el-form-item>
    <el-form-item label="手机">
        {{user.mobilw}}
    </el-form-item>
    <el-form-item label="媒体名称">
        <el-input v-model="user.name"></el-input>
    </el-form-item>
    <el-form-item label="媒体介绍">
        <el-input type="textarea" v-model="user.intro"></el-input>
    </el-form-item>
    <el-form-item label="邮箱">
        <el-input v-model="user.email"></el-input>
    </el-form-item>

    <el-form-item>
        <el-button type="primary" @click="onUpdateUser"
        :loading= "updateUserProfileLoading"
        >保存</el-button>
    </el-form-item>
            </el-form>
            </el-col>
            <el-col :span="4" :offset="2">
                <!-- jq操作dom方式，手动创建点击事件 -->
                <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
                <label for="file">
                    <el-avatar
                shape="square" :size="150" fit="cover"
                :src="user.photo"
                ></el-avatar>
                <p>点击修改头像</p>
                </label>
                <input id="file" type="file" hidden ref="file"
                @change="onfileChange"
                >
            </el-col>
        </el-row>
    </el-card>

        <!-- 修改头像 -->
        <el-dialog
    title="修改头像"
    :visible.sync="dialogVisible"
    append-to-body
    @opened="onDialogOpened"
    @closed="onDialogClaose"
    >
    <div class="preview-image-warp">
        <img class="preview-image" :src="previewImage"
        ref="preview-image"
        >
    </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
        type="primary"
        @click="onUpdatePhoto"
        :loading= "updateUserPhotoLoading"
        >确 定</el-button>
    </span>
    </el-dialog>
    </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'settingIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''
      }, // 用户资料

      dialogVisible: false, // 控制上传图片裁切预览显示状态
      previewImage: '', // 预览图片
      cropper: null, // 裁切器实例
      updateUserPhotoLoading: false, // 更新用户头像lloading状态
      updateUserProfileLoading: false // 更新基本信息loading状态
    }
  },
  computed: {},
  created () {
    this.loadUser()
  },
  methods: {
    onUpdateUser () {
      // 表单验证
      // 验证通过提交表单

      // 开始loading状态
      this.updateUserProfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        // console.log(res);
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 关闭loading状态
        this.updateUserProfileLoading = false

        // 发布通知，用户信息已修改
        globalBus.$emit('update-user', this.user)
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        // console.log(res);
        this.user = res.data.data
      })
    },
    onfileChange () {
      // 处于图片预览
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])
      // console.log(blobData);
      this.previewImage = blobData

      // 展示弹出层，预览用户选择图片
      this.dialogVisible = true

      // 解决选择相同的文件不触发 change 事件问题
      this.$refs.file.value = ''
    },

    // onDialogOpened完全打开时 用这个方法监听这个事件
    onDialogOpened () {
      // 图片裁切器必须基于img进行初始化
      // 注意：img必须是可见状态才能正常完成初始化
      // 因为我们这里要在对话框里面初始化裁切器，所以务必要在对话框完全打开的状态去进行初始化
      // 获取图片dom节点
      const image = this.$refs['preview-image']

      // 第一次初始化好以后，如果预览裁切的图片发生了变化，裁切器默认不会更新
      // 如果需要预览图片发生变化更新裁切器
      // 方式一：裁切器.replace方法
      // 方式二消灭裁切器，重新初始化

      // 初始化裁切器
      if (this.cropper) {
        this.cropper.replace(this.previewImage)
        return
      }
      this.cropper = new Cropper(image, {
        // 初始化比例 16 / 9 ，1/1
        aspectRatio: 1,
        // 只能在图片上裁切，不能超出范围
        viewMode: 1,
        // 可在屏幕移动位置
        dragMode: 'move',
        // 鼠标滚轮放大缩小
        aspectRatio: 1,
        // cropBoxMovable: false,
        // 不允许改变裁切器大小，固定比例
        cropBoxResizable: false,
        // background: false,
        movable: true

        // 当你移动裁切器的时候会触发调用crop方法
        // crop (event) {
        //     console.log(event.detail.x)
        //     console.log(event.detail.y)
        //     console.log(event.detail.width)
        //     console.log(event.detail.height)
        //     console.log(event.detail.rotate)
        //     console.log(event.detail.scaleX)
        //     console.log(event.detail.scaleY)
        // },
      })
    },
    onDialogClaose () {
      // 对话框关闭，消灭裁切器
      // this.cropper.destrop()
    },
    onUpdatePhoto () {
      // 让确定按钮开始loading
      this.updateUserPhotoLoading = true
      // 获取裁切的图片效果
      this.cropper.getCroppedCanvas().toBlob(file => {
        // console.log(blod);
        const fd = new FormData()
        fd.append('photo', file)
        //   // 请求更新用户头像请求提交fd
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false

          // 直接把裁切的结果文件对象转化为blod数据本地预览 更快一些
          this.user.photo = window.URL.createObjectURL(file)

          // 关闭确定按钮的loading
          this.updateUserPhotoLoading = false

          this.$message({
            type: 'success',
            message: '更新头像成功'
          })

          // 更新头部当前登录用户的信息
          // 发布通知，用户信息已修改
          globalBus.$emit('update-user', this.user)
          // 更新视图展示    把服务端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo
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
.preview-image-warp{
            /* Ensure the size of the image fit the container perfectly */
    .preview-image {
    display: block;

    /* This rule is very important, please don't ignore this */
    max-width: 100%;
    height: 200px;
    }
    }
</style>
