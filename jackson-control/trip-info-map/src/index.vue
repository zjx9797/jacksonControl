<template>
  <div class="trip-info-map">
    <div ref="chartContainer" class="trip-info-map__container">
      <div ref="echartDom" class="trip-info-map__chart" />

      <!-- 信息窗口 -->
      <transition name="large-window">
        <div
          v-show="showLargeWindow"
          class="trip-info-map__large-window"
          :style="{ left: `${largeWindowLeft}px` }"
        >
          <div class="trip-info-map__top-lane">
            <div>{{ infoData.name }}</div>
          </div>
          <div class="trip-info-map__bottom-lane">
            <div class="trip-info-map__station">
              <div class="trip-info-map__station-date">
                {{ infoData.start.date | formatDate }}
              </div>
              <div class="trip-info-map__station-detail">
                <div class="trip-info-map__station-name">
                  {{ infoData.start.name }}
                </div>
                <div class="trip-info-map__station-desc">
                  发出
                </div>
              </div>
            </div>
            <div class="trip-info-map__trip-status">
              <div class="trip-info-map__trip-status-tag">
                {{ infoData.status }}
              </div>
              <div class="trip-info-map__trip-status-icon" />
            </div>
            <div class="trip-info-map__station">
              <div class="trip-info-map__station-date">
                {{ infoData.end.date | formatDate }}
              </div>
              <div class="trip-info-map__station-detail">
                <div class="trip-info-map__station-name">
                  {{ infoData.end.name }}
                </div>
                <div class="trip-info-map__station-desc">
                  终点
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- 小 - 信息窗口 -->
      <transition name="large-window">
        <div
          v-show="showLargeWindow"
          class="trip-info-map__small-window"
          :style="{ right: `${smallWindowRight}px` }"
        >
          <div class="trip-info-map__top-lane">
            <div>{{ infoData.name }}</div>
          </div>
          <div class="trip-info-map__bottom-lane trip-info-map__small-bottom">
            <div class="trip-info-map__small-station-name">
              {{ infoData.start.name }}
            </div>
            <div class="trip-info-map__small-date">
              {{ infoData.start.date | formatDate }}
            </div>
            <div class="trip-info-map__small-desc">
              发出
            </div>
          </div>
        </div>
      </transition>

      <!-- 线段 -->
      <svg class="trip-info-map__line-svg" xmlns="http://www.w3.org/2000/svg">
        <!-- 大窗口 -->
        <transition name="large-window-line1">
          <line
            v-show="showLargeWindowLines"
            fill="none"
            :stroke="lineColor"
            stroke-width="2"
            stroke-dasharray="100"
            stroke-linejoin="null"
            :x1="endPoint.x"
            :y1="endPoint.y"
            :x2="endCornerPoint.x"
            :y2="endCornerPoint.y"
          />
        </transition>
        <transition name="large-window-line2">
          <line
            v-show="showLargeWindowLines"
            fill="none"
            :stroke="lineColor"
            stroke-width="2"
            stroke-dasharray="600"
            stroke-linejoin="null"
            :x1="endCornerPoint.x"
            :y1="endCornerPoint.y"
            :x2="endFixedPoint.x"
            :y2="endFixedPoint.y"
          />
        </transition>
        <transition name="circle">
          <circle
            v-show="showLargeWindowLines"
            :cx="endFixedPoint.x"
            :cy="endFixedPoint.y"
            r="2"
            :stroke="lineColor"
            stroke-width="1"
            :fill="lineColor"
          />
        </transition>
        <transition name="circle">
          <circle
            v-show="showLargeWindowLines"
            :cx="endFixedPoint.x"
            :cy="endFixedPoint.y"
            r="6"
            :stroke="lineColor"
            stroke-width="1"
            fill="none"
          />
        </transition>

        <!-- 小窗口 -->
        <transition name="small-window-line1">
          <line
            v-show="showLargeWindowLines"
            fill="none"
            :stroke="lineColor"
            stroke-width="2"
            stroke-dasharray="150"
            stroke-linejoin="null"
            :x1="startPoint.x"
            :y1="startPoint.y"
            :x2="startCornerPoint.x"
            :y2="startCornerPoint.y"
          />
        </transition>
        <transition name="small-window-line2">
          <line
            v-show="showLargeWindowLines"
            fill="none"
            :stroke="lineColor"
            stroke-width="2"
            stroke-dasharray="50"
            stroke-linejoin="null"
            :x1="startCornerPoint.x"
            :y1="startCornerPoint.y"
            :x2="startFixedPoint.x"
            :y2="startFixedPoint.y"
          />
        </transition>
        <transition name="circle">
          <circle
            v-show="showLargeWindowLines"
            :cx="startFixedPoint.x"
            :cy="startFixedPoint.y"
            r="2"
            :stroke="lineColor"
            stroke-width="1"
            :fill="lineColor"
          />
        </transition>
        <transition name="circle">
          <circle
            v-show="showLargeWindowLines"
            :cx="startFixedPoint.x"
            :cy="startFixedPoint.y"
            r="6"
            :stroke="lineColor"
            stroke-width="1"
            fill="none"
          />
        </transition>
      </svg>
    </div>
  </div>
</template>

<script>
import setting from './setting'
import ResizeObserver from 'resize-observer-polyfill'
import { debounce } from '../../../common/utils'
import genarateOption from './option-util'
import pos from './assets/pos'

export default {
  name: 'TripInfoMap',
  props: ['val'],
  data() {
    return {
      showLargeWindow: false,
      showLargeWindowLines: false,
      endPoint: {
        x: 0,
        y: 0
      },
      endCornerPoint: {
        x: 0,
        y: 0
      },
      endFixedPoint: {
        x: 0,
        y: 0
      },
      startPoint: {
        x: 0,
        y: 0
      },
      startCornerPoint: {
        x: 0,
        y: 0
      },
      startFixedPoint: {
        x: 0,
        y: 0
      },
      lineColor: '',
      currentIndex: 0,
      infoData: {
        start: {
          date: Date.now(),
          name: ''
        },
        end: {
          date: Date.now(),
          name: ''
        },
        status: '',
        name: ''
      },
      groupStartIndex: 0,
      playingData: null,
      totalData: [],
      mapData: [],
      restart: false
    }
  },
  computed: {
    largeWindowLeft() {
      return Number(this.val.config.find(_ => _.key === 'infoWindowSetting').items[0].value)
    },
    smallWindowRight() {
      return Number(this.val.config.find(_ => _.key === 'infoWindowSetting').items[1].value)
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        const date = new Date(value)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      return value
    }
  },
  mounted() {
    this.ecInstance = echarts.init(this.$refs.echartDom)
    this.resizeObserver = new ResizeObserver(debounce(() => {
      this.ecInstance ? this.ecInstance.resize() : ''
    }, 100))
    this.resizeObserver.observe(this.$refs.chartContainer)
  },
  beforeDestroy() {
    if (this.ecInstance) {
      this.ecInstance.dispose()
      this.ecInstance = null
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  },
  methods: {
    initCustomFilterParams(params) {
      console.log(params)
    },
    emitCustomFilterParams(params) {
      this.$emit('emitCustomFilterParams', params)
    },
    initComponentsData(params) {
      console.log('initComponentData')
      window.temp = params
      this.restart = true
      this.groupStartIndex = 0
      this.currentIndex = 0
      this.formatDisplayData(params.data)
      this.mapData = this.totalData.slice(0, 10)
      if (!this.playingData) {
        this.run()
        // this.play()
      }
    },
    // 更新 Option
    updateOption() {
      this.option = genarateOption(this.mapData)
      this.ecInstance.setOption(this.option, true)
    },
    // 轮流取数高亮
    async run() {
      console.log('start playing map...')
      while (true) {
        console.log('another play- -')
        await this.play()

        if (this.currentIndex === this.mapData.length - 1) {
          // 到了最后一项
          this.currentIndex = 0
          this.groupStartIndex++
          if (this.groupStartIndex * 10 >= this.totalData.length) {
            // 到了最后一组
            this.groupStartIndex = 0
          }
          this.mapData = this.totalData.slice(this.groupStartIndex * 10, this.groupStartIndex * 10 + 10)
          this.updateOption()
        } else {
          this.currentIndex++
        }
      }
    },
    async play() {
      // 刷新后，等待下一次 play 才更新地图
      if (this.restart) {
        this.updateOption()
        this.currentIndex = 0
        this.restart = false
      }

      this.playingData = this.mapData[this.currentIndex]
      await this.sleep(200)
      this.setIndicateLine(
        this.playingData.points[0].pos,
        this.playingData.points[this.playingData.points.length - 1].pos
      )
      this.setInfoData(this.playingData)
      this.activeMap()
      this.showLargeWindowLines = true
      this.showLargeWindow = true
      await this.sleep(1000 + 3100)
      this.showLargeWindowLines = false
      this.showLargeWindow = false
      await this.sleep(3100)
      this.deactiveMap()
      await this.sleep(100)
    },
    setInfoData(item) {
      this.infoData.status = item.status
      this.infoData.start.date = item.startDate
      this.infoData.start.name = item.points[0].label
      this.infoData.end.date = item.endDate
      this.infoData.end.name = item.points[item.points.length - 1].label
      this.infoData.name = item.name
    },
    // 定位地图的点
    setIndicateLine(startPos, endPos) {
      const startPoint = this.getPointFromGeo(startPos)
      const endPoint = this.getPointFromGeo(endPos)

      const { offsetHeight, offsetWidth } = this.$refs.chartContainer

      // 起始点
      this.startPoint.x = startPoint[0]
      this.startPoint.y = startPoint[1]
      this.startFixedPoint.x = offsetWidth - (this.smallWindowRight + 260)
      this.startFixedPoint.y = offsetHeight - 88
      this.startCornerPoint.x = this.startFixedPoint.x - 45
      this.startCornerPoint.y = this.startFixedPoint.y

      // 终点
      this.endFixedPoint.x = 157 + this.largeWindowLeft
      this.endFixedPoint.y = 126
      this.endPoint.x = endPoint[0]
      this.endPoint.y = endPoint[1]
      this.endCornerPoint.x = this.endPoint.x - 80
      this.endCornerPoint.y = this.endPoint.y

      const linesSerie = this.option.series.find(_ => _.type === 'lines')
      this.lineColor = linesSerie.data[this.currentIndex].lineStyle.color
    },
    // 获取地图点的 left/top 偏移值
    getPointFromGeo(geoPos) {
      const seriesModel = this.ecInstance.getModel().getSeriesByIndex(0)
      const coordSys = seriesModel.coordinateSystem
      return coordSys.dataToPoint(geoPos)
    },
    // 高亮地图
    activeMap() {
      const effectScatterSerie = this.option.series.find(_ => _.type === 'effectScatter')
      effectScatterSerie.data.push({
        name: this.playingData.points[0].label,
        value: this.playingData.points[0].pos,
        itemStyle: { normal: { color: this.lineColor } }
      }, {
        name: this.playingData.points[this.playingData.points.length - 1].label,
        value: this.playingData.points[this.playingData.points.length - 1].pos,
        itemStyle: { normal: { color: this.lineColor } }
      })
      this.ecInstance.setOption(this.option, true)
    },
    // 取消地图高亮
    deactiveMap() {
      const effectScatterSerie = this.option.series.find(_ => _.type === 'effectScatter')
      effectScatterSerie.data = []
      this.ecInstance.setOption(this.option, true)
    },
    formatDisplayData(data) {
      this.totalData = []
      if (data && data.data) {
        data.data.slice(1).forEach(row => {
          const startPos = pos[row[1]]
          const endPos = pos[row[2]]
          // 找不到经纬度，不放进地图
          if (!startPos || !endPos) {
            return
          }

          this.totalData.push({
            startDate: new Date(row[3]),
            endDate: new Date(row[4]),
            points: [{
              label: row[1],
              pos: startPos
            }, {
              label: row[2],
              pos: endPos
            }],
            status: row[6],
            name: row[5]
          })
        })
      }
    },
    async sleep(miniseconds) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, miniseconds)
      })
    }
  },
  setting
}

</script>

<style lang="less">
.trip-info-map {
  height: 100%;
  box-sizing: border-box;
  position: relative;

  &__container {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  &__chart {
    width: 100%;
    height: 100%;
  }

  // 信息窗口 - 大
  &__large-window {
    position: absolute;
    top: 30px;
    /*left: 50px;*/
    height: 95px;
    width: 314px;
    z-index: 5;
    border: 1px solid rgba(0, 204, 241, 0.6);
    border-radius: 6px;
    color: #fff;
    background-color: #040d54;
    box-sizing: border-box;
  }
  // 信息窗口 - 小
  &__small-window {
    position: absolute;
    /*right: 80px;*/
    bottom: 50px;
    height: 76px;
    width: 260px;
    z-index: 5;
    border: 1px solid rgba(0, 204, 241, 0.6);
    border-radius: 6px;
    color: #fff;
    background-color: #040d54;
    box-sizing: border-box;
  }
  &__line-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 6;
  }

  // 进入动画
  .large-window-line1-enter-active {
    animation: 0.8s line1;
    animation-fill-mode: backwards;
  }
  .small-window-line1-enter-active {
    animation: 0.8s small-line1;
    animation-fill-mode: backwards;
  }
  .large-window-line2-enter-active {
    animation: 1.2s line2 0.8s;
    animation-fill-mode: backwards;
  }
  .small-window-line2-enter-active {
    animation: 1.2s small-line2 0.8s;
    animation-fill-mode: backwards;
  }
  .circle-enter-active {
    animation: 0.1s fade-out 2s;
    animation-fill-mode: backwards;
  }
  .large-window-enter-active {
    animation: 1s fade-out 2s;
    animation-fill-mode: backwards;
  }

  // 离开动画
  .large-window-leave-active {
    animation: 1s fade-out reverse;
    animation-fill-mode: backwards;
  }
  .circle-leave-active {
    animation: 0.1s fade-out 1s reverse;
    animation-fill-mode: backwards;
  }
  .large-window-line2-leave-active {
    animation: 1.2s line2 1s reverse;
    animation-fill-mode: backwards;
  }
  .small-window-line2-leave-active {
    animation: 1.2s small-line2 1s reverse;
    animation-fill-mode: backwards;
  }
  .large-window-line1-leave-active {
    animation: 0.8s line1 2.2s reverse;
    animation-fill-mode: backwards;
  }
  .small-window-line1-leave-active {
    animation: 0.8s small-line1 2.2s reverse;
    animation-fill-mode: backwards;
  }

  @keyframes fade-out {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes line1 {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes line2 {
    from {
      stroke-dashoffset: 600;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes small-line1 {
    from {
      stroke-dashoffset: 150;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  @keyframes small-line2 {
    from {
      stroke-dashoffset: 50;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  // 信息窗口内的样式
  &__top-lane {
    height: 25px;
    width: 100%;
    border-bottom: solid 1px rgba(#00ccf1, 0.5);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 9px;
    & > div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      color: #fff;
      flex: 1;
    }
  }
  &__bottom-lane {
    height: calc(100% - 25px);
    width: 100%;
    display: flex;
    padding: 0 12px;
    box-sizing: border-box;
  }
  &__station {
    width: 100px;
    height: 100%;
    box-sizing: border-box;
    padding: 12px 0 12px 0;
  }
  &__station-date {
    font-size: 12px;
    color: #fff;
    margin-bottom: 6px;
  }
  &__station-detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  &__station-name {
    color: #00fffc;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &__station-desc {
    color: #d7f7ff;
    font-size: 14px;
  }
  &__trip-status {
    flex: 1;
  }
  &__trip-status-tag {
    border: 1px solid rgba(255, 200, 72, 0.6);
    border-radius: 12px;
    width: 68px;
    height: 26px;
    margin: 0 auto;
    margin-top: 7px;
    margin-bottom: 10px;
    font-size: 12px;
    color: #fbb400;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    &:before {
      content: ' ';
      position: absolute;
      top: 6px;
      left: -1px;
      height: 14px;
      width: 2px;
      background-color: #fbb400;
    }
    &:after {
      content: ' ';
      position: absolute;
      top: 6px;
      right: -1px;
      height: 14px;
      width: 2px;
      background-color: #fbb400;
    }
  }
  &__trip-status-icon {
    border-top: 2px dotted #00d2d4;
    width: 73px;
    height: 0;
    position: relative;
    margin: 0 auto;
    &:before {
      content: ' ';
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: #00d2d4;
      top: -4px;
      left: -2px;
    }
    &:after {
      content: ' ';
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 3px;
      background-color: #00d2d4;
      top: -4px;
      right: -2px;
    }
  }

  &__small-bottom {
    align-items: center;
  }
  &__small-station-name {
    color: #00fffc;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  &__small-date {
    font-size: 14px;
    color: #d7f7ff;
    margin-right: 10px;
  }
  &__small-desc {
    font-size: 14px;
    color: #d7f7ff;
  }
}
</style>
