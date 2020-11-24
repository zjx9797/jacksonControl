<template>
  <div
    class="text-content-jsonctr"
    :style="{
        'overflow-x': 'unset',
        'overflow-y': 'unset'
      }"
  >
    <div
      ref="text"
      :style="{
        ...textStyle,
        'white-space': 'nowrap'
      }"
      :class="{ 'text-txt': true }"
      v-html="value"
    />
  </div>
</template>

<script>
import setting from './setting'

export default {
  name: 'bigscreen-text',
  props: ['val'],
  data() {
    return {
      value: ''
    }
  },
  computed: {
    pageConfig() {
      return this.$store.state.page
    },
    textStyle() {
      let styleObj = {}
      let letterSpacing = 0
      let textAlignCenter = ''
      this.val.config.filter(_ => _.type !== 'loading-setting').forEach(item => {
        item.items.forEach(items => {
          if (['text-align'].includes(items.key)) {
            styleObj[items.css] = items.value ? items.cssVal : 'unset'
          } else if (['vertical-align'].includes(items.key) && items.value) {
            styleObj = Object.assign(styleObj, {
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)'
            })
          } else if (items.css == 'fontSize' && this.pageConfig.isAutoHeight && [0, undefined].includes(this.pageConfig.scaleMode) && this.isPreview) {
            styleObj.fontSize = (items.value / this.pageConfig.height) * 100 + 'vh'
          } else {
            styleObj[items.css] = `${items.value}${items.unit || ''}`
          }
          if (items.css === 'letterSpacing') {
            letterSpacing = items.value
          }
          if (items.key === 'text-align') {
            textAlignCenter = items.value
          }
        })
      })
      if (textAlignCenter === true && letterSpacing !== 0) {
        styleObj.textIndent = `${letterSpacing}em`
      }
      return styleObj
    }
  },
  methods: {
    initComponentsData(params) {
      this.value = params.data.data[1][1] || ''
    }
  },
  // NOTE: setting 字段建议不要删除
  setting
}

</script>

<style lang="less" scoped>
.text-content-jsonctr {
  height: 100%;
  display: flex;
  overflow-y: hidden;
  box-sizing: border-box;
  overflow-x: hidden;
  .text-txt {
    width: 100%;
    outline: none;
    font-size: 28px;
    overflow-wrap: break-word;
    &.vertical-align {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
