<template>
    <div class="comment-container">
        <el-card class="box-card">
    <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- /面包屑导航 -->
    </div>
    <!-- 1、把数据绑定给表格的data
    2、设计表格列
    3、给表格列绑定给要渲染的数据字段
    -->
        <el-table
        class="table-list"
        :data="articles"
        stripe
        style="width: 100%">
        <el-table-column
            prop="title"
            label="标题">
        </el-table-column>
        <el-table-column
            prop="total_comment_count"
            label="总评论数">
        </el-table-column>
        <el-table-column
            prop="fans_comment_count"
            label="粉丝评论数">
        </el-table-column>
        <el-table-column
            prop="address"
            label="评论状态">
            <template slot-scope="scope">
                {{ scope.row.comment_status ? '正常' : '关闭' }}
            </template>
        </el-table-column>
        <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
                <el-switch
            v-model="scope.row.comment_status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :disabled="scope.row.statusDisabled"
            @change="onStatusChange(scope.row)"
            >
            </el-switch>
            </template>
        </el-table-column>
    </el-table>
        <!--current-page 控制激活高亮的页码，初始肯定是第一页
        page-sizes 控制可选每页大小
        layout  页码布局调整
        -->
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size.sync="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        />
    </el-card>
    </div>
</template>

<script>
import { getArticles, updateCommentStatus } from '@/api/acticle'
export default {
  name: 'CommentIndex',
  components: {},
  props: {},
  data () {
    return {
      articles: [], // 文章数据列表
      totalCount: 0, // 总数居条数
      pageSize: 10,
      page: 1 // 当前激活的页码
    }
  },
  computed: {},
  created () {
    this.loadArticles()
  },
  methods: {
    handleSizeChange () {
      this.loadArticles(1)
    },
    handleCurrentChange (page) {
      // console.log(page);
      // 页码改变加载指定数据
      this.loadArticles(page)
    },
    loadArticles (page = 1) {
      this.page = page
      getArticles({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        // console.log(res);
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDisabled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },

    onStatusChange (article) {
      // 禁用开关
      article.statusDisabled = true

      // console.log(article);
      // 请求提交修改
      // console.log(article.comment_status);
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        // 启用开关
        article.statusDisabled = false
        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
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
.table-list{
    margin-bottom: 30px;
}
</style>
