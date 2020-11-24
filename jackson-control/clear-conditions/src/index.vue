<template>
  <div class="clear-conditions">
    <img
      src="@/assets/reset.svg"
      alt=""
      title="重置"
      :style="imgStyle"
      @click="clearDimensions"
    >
  </div>
</template>

<script>
import panelMixins from '../../../common/panel-mixin'
import { setting, params } from './setting'

export default {
  name: 'clear-conditions',
  props: ['val'],
  data() {
    return {
      isHover: false
    }
  },
  computed: {
    options() {
      return this.val.config.find(_ => _.key === 'options')
    },
    size() {
      return this.options.items[0].value
    },
    imgStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    }
  },
  methods: {
    clearDimensions() {
      this.$emit('emitDimensions', {
        uuid: this.val.uuid,
        ...params
      })
    }
  },
  setting
}
</script>

<style lang="less">
.clear-conditions {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
