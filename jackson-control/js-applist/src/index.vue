<template>
  <div class="app-list"></div>
</template>

<script>
export default {
  name: 'IndexDefault',
  props: {
    appList: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (location.hash.includes('stay=1')) {
      return
    }
    // 直接跳转第一个应用
    if (this.appList.length > 0) {
      const projectId = this.appList[0].projectId
      const appId = this.appList[0].id
      this.$emit('goTo', { projectId, appId })
    }
  }
}

</script>

<style lang="less">
.app-list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
}
</style>
