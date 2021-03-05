<template>
  <div class="fans-container">
      <!-- 1. 为 ECharts 准备一个具备大小（宽高）的画布容器 DOM -->
    <div ref="main" style="width: 600px;height:400px;"></div>
    <h2>地图图表实例</h2>
    <map-demo />
    <h2>纯粹的百度地图示例</h2>
    <bmap-demo />
  </div>
</template>

<script>
// 2、加载echarts
import echarts from 'echarts'
import MapDemo from './components/map-demo'
import BmapDemo from './components/bmap-demo'

export default {
  name: 'FansIndex',
  components: {
    MapDemo, // 百度地图结合 echarts
    BmapDemo // 纯粹的百度地图
  },
  props: {},
  data () {
    return {}
  },
  computed: {},
  created () {},
  methods: {},
  watch: {},
  mounted () {
    // 3. 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(this.$refs.main)

    // 4、指定图表的配置项和数据
    const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['粉丝分布']
      },
      xAxis: {
        data: ['广州', '上海', '北京', '杭州', '深圳', '成都']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    }

    // 5、使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>

<style lang="less" scoped>
</style>
