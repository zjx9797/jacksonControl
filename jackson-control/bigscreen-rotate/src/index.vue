<template>
  <div class="bigscreen-rotate">
    <img v-if="colorName === 'green' || colorName === 'yellow'" src="@/assets/out.png" alt="out" class="outer-image">
    <img v-else src="@/assets/out_red.png" alt="out" class="outer-image">
    <img
      v-if="colorName === 'green'"
      src="@/assets/type_green.png"
      class="inner-image"
      :style="animationStyle"
    >
    <img
      v-if="colorName === 'red'"
      src="@/assets/type_red.png"
      class="inner-image"
      :style="animationStyle"
    >
    <img
      v-if="colorName === 'yellow'"
      src="@/assets/type_yellow.png"
      class="inner-image"
      :style="animationStyle"
    >
    <div class="bigscreen-rotate__content">
      <div class="bigscreen-rotate__value" :style="valueStyle">
        {{ actualDisplay }}
      </div>
      <div class="bigscreen-rotate__label">
        {{ labelDisplay }}
      </div>
      <div class="bigscreen-rotate__percentage" :style="percentageStyle">
        {{ percentage }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bigscreen-rotate',
  props: ['val'],
  data() {
    return {
      actual: 0,
      threshold: 0,
      colorMap: {
        green: '#8DC63F',
        yellow: '#FFB400',
        red: '#FF5159'
      }
    }
  },
  computed: {
    spinSpeed() {
      return this.val.config[0].items[0].value
    },
    animationStyle() {
      return { animation: `spin ${this.spinSpeed}s linear infinite` }
    },
    isAlert() {
      return this.actual > this.threshold
    },
    // 超过90%用黄色，超过100的用红色，默认用绿色
    colorName() {
      const num  = parseInt(this.actual / this.threshold * 100)
      if (num > 100) {
        return 'red'
      } else if (num > 90) {
        return 'yellow'
      } else {
        return 'green'
      }
    },
    getOptionSign () {
      return this.val.config.find(item => item.key === 'optionSign')
    },
    getIsChinese () {
      return this.getOptionSign.items.find(item => item.key === 'isChinese').value
    },
    label() {
      return this.getOptionSign.items.find(item => item.key === (this.getIsChinese ? 'chineseLabel' : 'englishLabel')).value
    },
    percentage() {
      return parseInt(this.actual / this.threshold * 100) + '%'
    },
    valueStyle() {
      return {
        color: this.colorMap[this.colorName]
      }
    },
    percentageStyle() {
      return {
        color: this.colorMap[this.colorName]
      }
    },
    actualDisplay() {
      return String(this.actual).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    labelDisplay() {
      return `${this.label}(次)`
    }
  },
  methods: {
    // 外部数据渲染
    initComponentsData(params) {
      if (!params.data || params.data.data.length === 0) {
        return
      }
      this.actual = Number(params.data.data[0][0])
      this.threshold = Number(params.data.data[0][1])
    }
  },
  setting: {
    title: '报警数据',
    width: 145,
    height: 145,
    version: 2,
    data: {
      headerRows: 1,
      headerCols: 1,
      data: [
        [402, 400]
      ]
    },
    config: [{
      name: 'Options',
      key: 'optionSign',
      items: [{
        label: '旋转速度',
        type: 'panel-input',
        value: 3
      }, {
        key: 'isChinese',
        type: 'panel-switch',
        label: '中文页面',
        value: true
      }, {
        label: '类型',
        key: 'chineseLabel',
        type: 'panel-select',
        options: [{
          label: '设备报警',
          value: '设备报警'
        }, {
          label: '缺料报警',
          value: '缺料报警'
        }, {
          label: '质量报警',
          value: '质量报警'
        }],
        value: '设备报警',
        hideNSeek: { key: 'isChinese', value: true }
      }, {
        label: '类型',
        key: 'englishLabel',
        type: 'panel-select',
        options: [{
          label: 'Equipment Alarm',
          value: 'Equipment Alarm'
        }, {
          label: 'Material shortage Alarm',
          value: 'Material shortage Alarm'
        }, {
          label: 'QualityAlarm',
          value: 'QualityAlarm'
        }],
        value: 'Equipment Alarm',
        hideNSeek: { key: 'isChinese', value: false }
      }]
    }]
  }
}

</script>

<style lang="less">
.bigscreen-rotate {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  .outer-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .inner-image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  &__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  &__value {
    font-size: 30px;
    font-weight: bold;
  }
  &__label {
    color: #96EAF3;
    font-size: 12px;
  }
  &__percentage {
    margin-top: 5px;
    font-size: 12px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
