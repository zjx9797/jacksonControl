<template>
  <div class="bigscreen-doughnut">
    <div v-show="dataComplete && returnArrayReal.length > 0" class="chart-container">
      <div class="chart-item">
        <div ref="chart" class="chart-canvas" />
      </div>
    </div>
    <div
      v-if="$panel.showInsideNumber.value"
      v-show="dataComplete && returnArrayReal.length === 1"
      class="chart-inside-number"
    >
      <span :style="insideStyle">{{ insideText }}</span>
      <span :style="insidePostStyle">{{ insidePostText }}</span>
    </div>
    <div v-show="!dataComplete || returnArrayReal.length === 0" class="chart-loading">
      暂无数据
    </div>
  </div>
</template>

<script>
import { getPercentage, getOptionFromData, throttle } from './util.js'
import setting from './setting'
import panelMixin from '../../../common/panel-mixin'

export default {
  name: 'bigscreen-doughnut',
  props: ['val'],
  mixins: [panelMixin],
  data() {
    return {
      option: {},
      returnArrayReal: [],
      dataComplete: false,
    }
  },
  computed: {
    insideText() {
      if (this.returnArrayReal.length === 0) {
        return ''
      }
      const row = this.returnArrayReal[0]
      return `${getPercentage(row)}`
    },
    insidePostText() {
      if (this.returnArrayReal.length === 0) {
        return ''
      }
      return this.$panel.insidePost.value
    },
    insideStyle() {
      const style = {}
      this.$panel.insideFont.items.forEach(({ key, unit, value }) => {
        style[key] = `${value}${unit || ''}`
      })
      return style
    },
    insidePostStyle() {
      const style = {}
      this.$panel.insidePostFont.items.forEach(({ key, unit, value }) => {
        style[key] = `${value}${unit || ''}`
      })
      return style
    }
  },
  watch: {
    option: {
      deep: true,
      handler() {
        if (this.ecInstance) {
          this.ecInstance.setOption(this.option, true)
        }
      }
    },
    'val.config': {
      deep: true,
      handler() {
        this.initComponentsData()
      }
    }
  },
  mounted() {
    this.ecInstance = echarts.init(this.$refs.chart)
    this.resizeObserver = new ResizeObserver(throttle(() => {
      this.ecInstance ? this.ecInstance.resize() : ''
    }, 500))
    this.resizeObserver.observe(this.$refs.chart)
  },
  beforeDestroy() {
    if (this.ecInstance) {
      this.ecInstance.dispose()
      this.ecInstance = null
    }
    this.resizeObserver.disconnect()
  },
  methods: {
    initCustomFilterParams(params) {
    },
    emitCustomFilterParams(params) {
    },
    // 外部数据渲染
    initComponentsData(params) {
      if (!params) {
        this.updateOption()
        return
      }

      if (params.type === 'api' || params.type === 'mock') {
        if (!params.data || !params.data.data) {
          this.returnArrayReal = []
          this.option = {}
          this.dataComplete = true
          return
        }

        let returnArray = [...params.data.data]
        if (returnArray.length > 7) {
          returnArray = returnArray.slice(0, 8)
        }

        const arrayLen = returnArray.length
        this.returnArrayReal = returnArray.slice(1, arrayLen)
        this.updateOption()
        this.dataComplete = true
        this.$nextTick(() => {
          this.ecInstance.resize()
        })
      }
    },
    updateOption() {
      this.option = getOptionFromData(
        this.returnArrayReal,
        this.$panel.colors.value,
        this.$panel.bgColor.value,
        this.$panel.showLegend.value,
        this.$panel.lineWidth.value
      )
    }
  },
  setting
}
</script>

<style lang="less" scoped>
.bigscreen-doughnut {
  color: #fff;
  position: relative;
  height: 100%;
  box-sizing: border-box;

  .chart-container {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
  }

  .chart-loading {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #fff;
  }

  .chart-inside-number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: baseline;
    justify-content: center;
  }
}

.chart-item {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.chart-canvas {
  width: 100%;
  height: 100%;
}
</style>
