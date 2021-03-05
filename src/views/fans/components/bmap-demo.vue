<template>
    <div id="container" class="bmap"></div>
</template>

<script>
export default {
  name: 'BmapDemo',
  components: {},
  props: {},
  data () {
    return {

    }
  },
  computed: {},
  created () {

  },
  methods: {

  },
  watch: {},
  mounted () {
    const map = new window.BMap.Map('container')
    const point = new window.BMap.Point(116.404, 39.915) // 初始化地图,设置中心点坐标和地图级别
    map.centerAndZoom(point, 15)
    map.enableScrollWheelZoom(true) // 开启鼠标滚轮缩放
    // const scaleCtrl = new window.BMapGL.ScaleControl() // 添加比例尺控件
    // map.addControl(scaleCtrl)
    // const zoomCtrl = new window.BMapGL.ZoomControl() // 添加缩放控件
    // map.addControl(zoomCtrl)
    // const cityCtrl = new window.BMapGL.CityListControl() // 添加城市列表控件
    // map.windo.addControl(cityCtrl)
  }
}
</script>

<style lang="less" scoped>
.bmap {
    width: 800px;
    height: 600px;
    border: 1px solid #000;
}
</style>
