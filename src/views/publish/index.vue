<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $route.query.id ? "修改文章" : "发布文章"
          }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 表单属性 -->
      <el-form ref="publish-form"
      :model="article"
      :rules="formRules"
      label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
        <el-tiptap
    v-model="article.content"
    :extensions="extensions"
    lang="zh"
    placeholder="Write something …"
    height="400"
        ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>

          <!-- 我们需要把选择的封面地址放到article.cover.image的数组里面

          当你给事件处理函数传递了自定义参数以后，就无法得到原来的哪个数据参数了。

          如果想要在事件处理函数自定义传参以后还想得到原来的事件本身的参数，测手动指定￥event
          他就代表那个事件本身的参数

          再组件上v-model
          当你需要给子组件提供的数据既要使用也有修改，这个时候可以使用v-model简化数据绑定
          给子组件传递了一个叫vaule的数据
          v-model="article.cover.images[index]"代表两句话
            :vaule="article.cover.images[index]"
            @input="article.cover.images[index] = 事件参数"
          -->
          <template v-if="article.cover.type > 0">
          <upload-cover
          :key="cover"
          v-for="(cover, index) in article.cover.type"
          v-model="article.cover.images[index]"
          />

          <!-- <upload-cover
          :key="cover"
          v-for="(cover, index) in article.cover.type"
          :cover-image="article.cover.images[index]"
          @update-cover="onUpdateCover(index, $event)"
          /> -->
          </template>

        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channels.name"
              :value="channels.id"
              v-for="(channels, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadCover from './components/upload-cover'
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/acticle'

import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image,
  TextAlign,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TextColor,
  TodoItem,
  TodoList,
  Fullscreen
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    UploadCover
  },
  props: {},
  data () {
    return {
      channels: null, // 文章频道列表
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: {
          type: 1, // 封面的类型 -1：自动，  0：无图  ，1-1张  ，  3-3张
          images: []
        },
        channel_id: null
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 3 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new TextAlign(),
        new TextColor(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          // 默认还把图片生成 base64
          // 字符串和内容存储在一起，如果自定义图片上传
          uploadRequest (file) {
            // console.log(uploadRequest)
            // console.log(file);
            // return 'xxx'
            const fd = new FormData()
            fd.append('image', file)
            // // 第一个return是返回 promise对象
            // // 为什么?因为axios本身就是返回promise对象
            return uploadImage(fd).then(res => {
              //   // 这个return时返回最后的结果
              return res.data.data.url
              // console.log(res);
            })
          }// 图片上传的方法，返回一个promise<url>
        }),
        new Table(),
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new TodoItem(),
        new TodoList(),
        new Fullscreen()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          {
            // {required: true, message: '请输入文章内容',trigger: 'change'}
            validator (rule, value, callback) {
            // console.log("content validattor");
              if (value === '<p></p>') {
              // 验证失败
                callback(new Error())
              } else {
              // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  computed: {},
  created () {
    this.loadChannels()

    // 由于我们让发布和修改用同一个组件
    // 所以这里要判断
    // 如果路由路径参数中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    loadChannels () {
      getArticleChannels().then(({ data }) => {
        this.channels = data.data.channels
      })
    },
    // async onPublish (draft) {
    //   const { data } = await addArticle(this.article, draft)
    //   console.log(data)
    // }
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        // 验证失败停止提交表单
        if (!valid) {
          return
        }

        // 验证通过提交表单
        // 找到数据接口
        // 封装请求方法
        // 如果是修改文章，则执行修改操作，否则执行添加操作
        const articleId = this.$route.query.id
        if (articleId) {
        // console.log("执行修改");
        // 编辑文章
          updateArticle(articleId, this.article, draft)
            .then((res) => {
            // console.log(res);
              this.$message.success(`${draft ? '存入草稿' : '修改文章'}成功！`)
              this.$router.push('/article')
            })
            .catch((err) => {
              this.$message.error(
              `${draft ? '存入草稿' : '修改文章'}失败！` + err
              )
            })
        } else {
        // console.log("执行新建");
        // 发布新文章
          addArticle(this.article, draft)
            .then((res) => {
            // console.log(res);
              this.$message.success(`${draft ? '存入草稿' : '发布文章'}成功！`)
              this.$router.push('/article')
            })
            .catch((err) => {
              this.$message.error(
              `${draft ? '存入草稿' : '发布文章'}失败！` + err
              )
            })
        }
      })
    },

    // 修改文章：加载文章内容
    loadArticle () {
      // console.log('loadArticle')
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据
      getArticle(this.$route.query.id).then((res) => {
        // 模板响应展示
        this.article = res.data.data
      })
    },

    onUpdateCover (index, url) {
      this.article.cover.images[index] = url
    }
  },
  watch: {},
  mounted () {}
}
</script>

<style lang="less" scoped>
</style>
