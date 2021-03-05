<template>
  <div class="acticle-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelsId" placeholder="请选择频道">
            <el-option
            label="全部"
            :value="null"
            ></el-option>
            <el-option
            :label="channel.name"
            :value="channel.id"
            v-for="(channel, index) in channels" :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format= "yyyy-MM-dd "
            value-format= "yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item>
            <!-- button按钮的click事件有一个默认参数
            当你没有指定参数的时候，他会默认传递一个没有用的数据 -->
          <el-button type="primary" @click="loadActicles(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">根据筛选条件查询到 {{ totalCount }} 条结果:</div>
      <!-- 数据列表 -->
      <!-- table表格组件 -->
      <!-- 1、把需要展示的数组列表绑定给table组件的data属性
    注意：你不要去v-for遍历，他自己会遍历-->
      <!-- 2、设置表格列el-table-column
    width 可以设置表格列的宽度
    label 可以设定列的标题
    prop 用来设定要渲染的列表项数据字段-->

      <el-table
        :data="articles"
        stripe
        border
        style="width: 100%"
        class="list-table"
        size="small"
        v-loading="loading"
      >
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
              <el-image
      style="width: 100px; height: 100px"
      :src="scope.row.cover.images[0]"
      fit="cover"
      lazy
      ><div slot="placeholder" class="image-slot">
        加载中<span class="dot">...</span>
      </div></el-image>
            <!-- <img
              v-if="scope.row.cover.images[0]"
              class="article-cover"
              :src="scope.row.cover.images[0]"
              alt=""
            />
            <img v-else class="article-cover" src="./3.jpg" alt="" /> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 如果需要自定义列表模板中获取当前遍历项数据，那么就在template上声明slot-scope="scope" -->
            <el-tag :type="acticleStatus[scope.row.status].type">{{
              acticleStatus[scope.row.status].text
            }}</el-tag>
            <!-- <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success"
              >审核通过</el-tag
            >
            <el-tag v-else-if="scope.row.status === 3" type="danger"
              >审核失败</el-tag
            >
            <el-tag v-else-if="scope.row.status === 4" type="info"
              >已删除</el-tag
            > -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column label="操作">
          <!-- 如果需要自定义表格列模板，则把需要自定义的内容放到template里面 -->
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              circle
              icon="el-icon-edit"
              @click="$router.push('/publish?id='+ scope.row.id.toString())"
            ></el-button>
                <el-button
                size="small"
                type="danger"
                circle
                icon="el-icon-delete"
                @click="onDeleteAricle(scope.row.id)"
                ></el-button>
            </template>
            </el-table-column>
        </el-table>

    <!-- totaly用来设定总数据的条数
    它的默认按照10条每页计算总页码
    page0size每页显示的条目个数，支持 .sync
    修饰符，默认每页10条-->

        <!-- 列表分页 -->
        <el-pagination
        layout="prev, pager, next"
        background
        :total="totalCount"
        :page-size= "pageSize"
        :disabled="loading"
        :current-page.sync="page"
        @current-change="oncurrentChange"
        />
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from '@/api/acticle'

export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      articles: [], // 文章数据列表
      acticleStatus: [
        { status: 0, text: '草稿', type: 'warning' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'danger' },
        { status: 4, text: '已删除', type: 'info' }
      ],
      totalCount: 0, // 总数居调试
      pageSize: 10, // 每页大小
      status: null, // 查询文章的状态，不传就是全部
      channels: [], // 文章频道列表
      channelsId: null, // 查询文章的频道
      rangeDate: null, // 筛选的范围日期
      loading: true, // 表单数据加载中
      page: 1 // 当前页码
    }
  },
  computed: {},
  created () {
    this.loadActicles(1)
    // this.loadActicles()
    this.loadgetArticleChannels(1)
  },
  methods: {
    loadActicles (page) {
      // 展示加载中loading
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channels_id: this.channelsId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, // 开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null // 截至日期
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount

        // 关闭加载中
        this.loading = false
      })
    },

    // onSubmit() {
    //   console.log("submit!");
    // },articleId
    async loadgetArticleChannels () {
      const { data } = await getArticleChannels()
      // console.log(data)
      this.channels = data.data.channels
    },

    oncurrentChange (page) {
      this.loadActicles(page)
    },
    // 点击删除id点击事件
    onDeleteAricle (acticleId) {
      // console.log(acticleId)
      // console.log(acticleId.toString())
      this.$confirm('确认删除吗', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认则行在这里
        deleteArticle(acticleId.toString()).then(res => {
          // console.log(res)
          // 删除成功，更新当前页文章数据列表
          this.loadActicles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 找到数据接口
      // 封装请求方法
      // 删除请求调用
      // 处理响应结果
      // console.log('onDeleteAricle')
    },

    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    }
  },
  watch: {},
  mounted () {}
}
</script>

<style lang="less" scoped>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 60px;
  background-size: cover;
}
</style>
