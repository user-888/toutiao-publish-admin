<template>
    <div class="home-container">welcome</div>
</template>

<script>
export default {
  // 指定name选项的另一个好处是便于调式
  // 有名字的组件有更友好的警告提示信息
  // 另外，当在有vue-dvools，未命名组件将显示<Anony....>
  // 结论：给一个组件起名字是非常有意义的，尽量不要让组件的名字重复。
  name: 'HomeIndex',
  components: {},
  props: {},
  data () {
    return {

    }
  },
  computed: {},
  created () {
    // if(没有登录)
  },
  methods: {

  },
  watch: {},
  mounted () {

  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  background: #fff url(./home.jpg) no-repeat;
  background-position: 50%;
  // background: #fff;
  // background-size: cover;
}
</style>
