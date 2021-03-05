<template>
    <div class="image-list">
        <div class="action-head">
        <el-radio-group v-model="collect" size="small" @change="loadImages(1)">
        <el-radio-button :label="false">全部</el-radio-button>
        <el-radio-button :label="true">收藏</el-radio-button>
    </el-radio-group>
    <el-button
    size="small"
    type="success"
    @click="dialogTableVisible= true"
    v-if="isShowAdd"
    >上传素材</el-button>
    </div>
    <!-- 素材管理 -->
        <el-row :gutter="10">
    <el-col :xs= "12" :md= "6" :lg= "4" :sm="6"
    v-for="(img,index) in images" :key="index"
    class="image-item"
    @click.native="selected = index"
    >
        <el-image
        style=" height: 100px"
        :src="img.url"
        fit="cover"
        ></el-image>
        <div class="selected" v-if="isShowSelected && selected === index">
        </div>
        <div class="image-action" v-if="isShowAction">
            <el-button type="warning"
            :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off' "
            circle
            size="small"
            @click="onCollect(img)"
            :loading="img.loading"
            ></el-button>
            <el-button
            icon="el-icon-delete-solid"
            circle
            type="danger"
            size= "small"
            :loading="img.loading"
            @click="onDelete(img)"
            ></el-button>
            <!-- <i
            :class="{
                'el-icon-star-on': img.is_collected,
                'el-icon-star-off':!img.is_collected
            }"
            @click="onCollect(img)"
            ></i> -->
            <!-- <i class="el-icon-delete-solid"></i> -->
        </div>
    </el-col>
    </el-row>
    <!-- /素材管理 -->
    <!-- 素材分页 -->
        <el-pagination
    background
    layout="prev, pager, next"
    :total="totalCount"
    :page-size="pageSize"
    :current-page.sync="page"
    @current-change="onPageChange"
    >
    </el-pagination>
    <!-- /素材分页 -->

    <el-dialog title="上传素材" :visible.sync="dialogTableVisible"
    :append-to-body="true"

    >
    <!-- // upload 组件本身就支持请求提交上传操作，说白了你使用它不用自己 去发请求 -->
    <!-- 他自己会去发请求， -->
    <!-- 请求方法：默认自己是post
        请求路径： action 必须完整路径
        请求头headers-->
    <el-upload
        v-if="dialogTableVisible"
        class="upload-demo"
        drag
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        multiple
        :on-success= "onUploadSuccess"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
</el-dialog>
    </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'
export default {
  name: 'ImageList',
  components: {},
  props: { // 数据定义的方式
    // 是否显示添加图片素材
    isShowAdd: {
      type: Boolean, // 布尔值
      default: true // 默认值
    },
    // 是否显示图片下方的操作(收藏和删除)
    isShowAction: {
      type: Boolean,
      default: true
    },
    isShowSelected: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [], // 图片素材列表
      dialogTableVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0, // 总数据条数
      pageSize: 10, // 每页大小
      page: 1, // 当前页码
      selected: null // 选中的索引
    }
  },
  computed: {},
  created () {
    // 页面初始化加载第一页图片
    this.loadImages(1)
  },
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // img 对象本来没有loadings数据
          // 我们这里收到的往里面添加数据是用来控制每个收藏按钮的loading状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },

    // onCollectChange () {
    // this.loadImages(1)
    // },

    onUploadSuccess () {
      // 关闭对话框
      this.dialogTableVisible = false

      // 更新素材列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },

    onPageChange (page) {
      this.loadImages(page)
    },

    onCollect (img) {
      // 展示loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        // console.log(res)
        img.is_collected = !img.is_collected
        // 关闭loading
        img.loading = false
      })
      // if (img.is_collected){
      //     // 如果已收藏，取消收藏
      //     collectImage(img.id, false)
      // }else{
      //     // 没有收藏，添加收藏
      //     collectImage(img.id,true)
      // }
    },
    async onDelete (img) {
      // 提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 判断是否要删除
      if (confirmResult !== 'confirm') return this.$message.info('你点击了取消按钮！')

      img.loading = true
      deleteImage(img.id).then((res) => {
        this.$message.success('删除图片成功！')
        this.loadImages()
        img.loading = false
      }).catch(err => {
        this.$message.error('删除图片失败：' + err)
        img.loading = false
      })
    }
  },
  watch: {},
  mounted () {

  }
}
</script>

<style lang="less" scoped>
.action-head {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
}
.image-item{
    position: relative;
}
.image-action {
    font-size: 25px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: rgb(231, 231, 231);
    height: 40px;
    background-color: rgba(204, 204, 204,.5);
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
}
.selected {
    background: url(./selected.png) no-repeat;
    background-size: cover;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
