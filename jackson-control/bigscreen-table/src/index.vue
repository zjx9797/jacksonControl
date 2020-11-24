<template>
  <div class="bigscreen-table" ref="tabel">
    <!-- 表格头部 -->
    <!--  -->
    <template>
      <ul class="bigscreen-table__head" v-if="!isDefaultHeadData || (isDefaultHeadData && defaultHeadData.length > 0)">
        <template v-for="(item, index) in dataHead">
          <li
            :key="index"
            :class="{'bigscreen-table__flex': !item.width}"
            :style="`${item.width ? item.width : ''} line-height: ${headHight}; ${headeStyle}`">
            {{ item.value }}
          </li>
        </template>
      </ul>
      <!-- 表格中的滚动数据 -->
      <div 
        class="bigscreen-table__content"
        :class="{'bigscreen-table__content-auto': !isTableScroll}"
        :style="`height: ${bodyHeight};`"
        v-if="!isEmpty"
        @mouseenter="scrollBoxEnter"
        @mouseleave="scrollBoxLeave">
        <div class="bigscreen-table__contentBox" :style="styleTranform">
          <div ref="body" class="bigscreen-table__body" :class="{'bigscreen-table__body-no-third': showStripe }">
            <ul class="bigscreen-table__tr" :class="[{'bigscreen-table__tr-bm': showStripe}, isEventTabel && item.class]" v-for="(item, index) in dataBody" :key="index">
              <template v-for="(itemInner, indexInner) in item.value">
                <li
                  :key="indexInner"
                  :class="[{'bigscreen-table__flex': !itemInner.width}, itemInner.class]"
                  :style="`${itemInner.width ? itemInner.width : ''} ${itemInner.style} line-height: ${lineHeight}; color: ${itemInner.color};`">
                  {{ itemInner.value }}
                </li>
              </template>
            </ul>
          </div>
          <!-- 为了具有无缝滚动效果需要一份副本 -->
          <div v-if="reallyBodyHeight >= maxHight && dataBody.length && isTableScroll" class="bigscreen-table__body" :class="{'bigscreen-table__body-no-third': showStripe }">
            <ul class="bigscreen-table__tr" :class="[{'bigscreen-table__tr-bm': showStripe}, isEventTabel && item.class]" v-for="(item, index) in dataBody" :key="index">
            <!-- <ul class="bigscreen-table__tr" :class="{'bigscreen-table__tr-bm': showStripe}"> -->
              <template v-for="(itemInner, indexInner) in item.value">
                <li
                  :key="indexInner"
                  :class="[{'bigscreen-table__flex': !itemInner.width}, itemInner.class]"
                  :style="`${itemInner.width ? itemInner.width : ''} ${itemInner.style} line-height: ${lineHeight};`">
                  {{ itemInner.value }}
                </li>
              </template>
            </ul>
          </div>
        </div>
        <!-- 当bigscreen-table__body中的高度大于能显示滚动的醉倒高度时才能具有动画效果 -->
        <!-- :class="{'bigscreen-table__tr-warning': index === 3}" -->
      </div>
    </template>
    <div v-if="isEmpty" class="bigscreen-table__empty" :style="`height: calc(100% - ${headHight})`">
      暂无数据
    </div>
  </div>
</template>

<script>
const keyId = 0
function throttle(fn, delay) {
  let timer = null
  return function () {
    var context = this, args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}
const st = 12

const arrAliasFormatter = function(arr = [], aliasMap = {}) {
  let result = []
  let item = arr[0] || ''
  if (arr && arr.length) {
    if (aliasMap[item]) {
      let alias = item
      if (aliasMap[item].alias) {
        alias = aliasMap[item].alias
      }else if(typeof aliasMap[item] === 'string') {
        alias = aliasMap[item]
      }
      result.push(alias)
    } else {
      result.push(item)
    }
    result = result.concat(arrAliasFormatter(arr.splice(1, arr.length), aliasMap))
  }
  return result
}
// 数据集索引别名在图表label上的体现
const chartLabelAliasFormatter = function (label = '', aliasMap = {}) {
  const arr = label.toString().split('\u0001')
  const result = arrAliasFormatter(arr, aliasMap)
  return result.join('\u0001')
}
import setting from './setting'
import mixin from './mixin'

export default {
  name: 'bigscreen-table',
  props: ['val'],
  mixins: [mixin],
  computed: {
    items() {
      return [].concat(...this.val.config.filter(panel => panel.items).map(panel => panel.items)) // 获取有 items 者的 items...
    },
    titleStyle() {
      const styleObj = {}
      this.items.forEach((items) => {
        if (styleObj[items.css]) {
          styleObj[items.css] += ` ${items.value}${items.unit || ''}`
        } else {
          styleObj[items.css] = `${items.value}${items.unit || ''}`
        }
      })
      return styleObj
    },
    headeStyle() {
      return this.parseTableHeaderStyle()
    },
    contentStyle() {
      return this.parseTableContentStyle() || {}
    },
    contentWidth() {
      return this.parseTableColumnStyle() || {}
    },
    // 内容中的行高，默认为20
    lineHeight() {
      return `${this.$panel.tableContentHeight.value || 20}px`
    },
    dom() {
      return this.$refs.tabel
    },
    // 头部的lineheight，即头部的高度
    headHight() {
      return '26px'
    },
    // 滚动数据能显示的最大高度
    maxHight() {
      // 外围最大盒子 - 头部高度 - 三条最新数据的高度
      const h = this.componentHeight - parseInt(this.headHight)
      return h
    },
    // 滚动数据的高度，数据少时按其本身高度显示
    bodyHeight() {     
      return `${this.reallyBodyHeight >= this.maxHight ? this.maxHight : this.reallyBodyHeight}px`
    },
    showStripe() {
      return this.$panel.showStripe.value
    },
    isTableScroll() {
      return this.$panel.isScrollTable.value
    },
    isScrollEnter() {
      return this.$panel.isScrollEnter.value
    },
    tableScrollTimeSet() {
      return this.$panel.tableScrollTimeSet.value
    },
    tableScrollTimeStop() {
      return this.$panel.tableScrollTimeStop.value
    },
    // 固定表头数据
    isDefaultHeadData() {
      return this.$panel.isDefaultHeadData.value
    },
    defaultHeadData() {
      const str = this.$panel.defaultHeadData.value.replace(/[\r\n]/g,"")
      return str.split(',')
    },
    // 是否是驱动未完成列表
    isEventTabel() {
      return this.$panel.isEventTabel.value
    },
    // 驱动未完成列表的parentId表头名
    eventParentId() {
      return this.$panel.eventParentId.value
    },
    // 驱动未完成列表的计划关闭时间表头名
    eventCloneName() {
      return this.$panel.eventCloneName.value
    },
    // 驱动未完成列表的跟进状态表头名（超时未关闭需要标红）
    eventStatusName() {
      return this.$panel.eventStatusName.value
    }
  },
  data() {
    return {
      isEmpty: true,
      mapData: {
        newData: []
      },

      dataHead: [],
      dataBody: [],

      componentHeight: null,
      reallyBodyHeight: null,
      // body固定头部三条
      resffss: {},
      tabelTime: null,
      tabelTimeDelay: null,
      
      // 滚动的高度
      translateY: 0,
      styleTranform: 'transform: translateY(0)',

      // 是否处于移进滚动区域中
      isScrollRange: false,
      // 获取唯一id所处的下标，因为唯一id不显示
      // 驱动未完成列表静态表头数据（需要特殊处理的）
      eventHeadData: {
        // 返回的数据是子事件列表，属于同一个父级的需要放在一起，排序
        parentId: '',
        parentIdSign: null,
        parentIdClass: {},
        cloneTimeName: '',
        cloneTimeSign: null,
        currentTime: null,
        statusName: '',
        statusNameSign: null
      },
      aliasMap:{},
      colAliasMap: {}
    }
  },
  mounted() {
    this.componentHeight = this.dom ? this.dom.offsetHeight : null
    this.resizeObserver = new ResizeObserver(throttle(() => {
      this.clearTime()
      // this.tabelTimeDelay && clearTimeout(this.tabelTimeDelay)
      // this.tabelTime && clearInterval(this.tabelTime)
      this.componentHeight = this.dom ? this.dom.offsetHeight : null;
      this.translateY = 0;
      this.styleTranform = `transform: translateY(-${this.translateY}px)`
      this.scrollInit()
    }), 500)
    this.resizeObserver.observe(this.dom)
  },
  beforeDestroy() {
    this.clearTime()
    this.resizeObserver.disconnect()
  },
  methods: {
    scrollBoxEnter() {
      this.isScrollRange = true
      this.isScrollEnter && this.clearTime()
    },
    scrollBoxLeave() {
      this.isScrollRange = false
      if (this.isScrollEnter) {
        this.clearTime()
        this.scrollInit()
      }
    },
    clearTime() {
      if (this.tabelTimeDelay) {
        clearTimeout(this.tabelTimeDelay)
        this.tabelTimeDelay = null
      }
      if (this.tabelTime) {
        clearInterval(this.tabelTime)
        this.tabelTime = null
      }
    },
    // 外面筛选器改变时调用此方法
    /* eslint-disable no-unused-vars */
    initCustomFilterParams(params) {
      // console.log(params)
    },
    // 内部筛选器改变时发射事件
    emitCustomFilterParams(params) {
      this.$emit('emitCustomFilterParams', params)
    },
    // 外部数据渲染
    /* eslint-disable no-unused-vars */
    initComponentsData(res) {
      // 假如开启固定表头数据，需要读取配置项作为表头数据（空数据也要显示）
      if (this.isDefaultHeadData && this.defaultHeadData.length > 0 && !this.dataBody.length) {
        this.mapData.head = this.defaultHeadData
        this.setHeadData()
      }
      if (!res || !res.data || !res.data.data || !res.data.data.length) {
        this.isEmpty = true
      } else {
        this.isEmpty = false
        this.aliasMap = res.aliasMap || {}
        this.colAliasMap = res.colAliasMap || {}
        const data = [...res.data.data]
        data[0] && (data[0] = this.tableCellFormatter(data[0] || {}))
        // 获取第一行的数据为表头，其余为表内容
        !this.isDefaultHeadData && (this.mapData.head = data[0])
        !this.isDefaultHeadData && (this.setHeadData())
        // 获取第一行的数据为表头，其余为表内容
        const madeBody = data.slice(1)
        // 驱动事件未完成列表
        if (this.isEventTabel) {
          const parentIdArr = [...new Set (madeBody.map(item => item[this.eventHeadData.parentIdSign]))]
          const cl = ['bigscreen-table__tr-event-one', 'bigscreen-table__tr-event-two']
          this.eventHeadData.parentIdClass = {}
          parentIdArr.map((item, index) => {
            this.eventHeadData.parentIdClass[item] = index % 2 === 0 ? cl[0] : cl[1]
          })
          this.eventHeadData.currentTime = this.getLocalTime()
        }
        const bodyMap = madeBody.map(this.dealEveryBodyData)
        // 当mapData.bodyMap，没有数据时是属于第一次渲染，不做过滤
        this.dataBody = bodyMap
        console.log('bodyMap', bodyMap);

        this.clearTime()
        this.scrollInit()
        this.resffss = res
      }
    },
    // 重建别名
    tableCellFormatter (headData) {
      const data = headData.join('\u0001')
      const result = chartLabelAliasFormatter(data, this.aliasMap).split('\u0001')
      return result
    },
    // 将本地时间转化为东八区时间
    getLocalTime() {
      const timezone = 8
      const offset_GMT = new Date().getTimezoneOffset()
      const nowDate = new Date().getTime()
      const targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
      return targetDate.getTime()
    },
    initDataAnimation() {
      this.clearTime()
      this.reallyBodyHeight = this.dataBody.length > 0 ? this.dataBody.length * (parseInt(this.lineHeight) + 1) : 0
      this.translateY = 0;
      this.styleTranform = `transform: translateY(-${this.translateY}px)`
      this.reallyBodyHeight >= this.maxHight && this.scrollInit()
    },
    // 表格滚动入口
    scrollInit () {
      this.reallyBodyHeight = this.dataBody.length > 0 ? this.dataBody.length * (parseInt(this.lineHeight) + 1) : 0
      if (this.reallyBodyHeight < this.maxHight) {
        this.translateY = 0;
        this.styleTranform = `transform: translateY(-${this.translateY}px)`
      } else {
        !this.tabelTimeDelay && this.isTableScroll && this.bodyAnimation()
      }
    },
    // 表格滚动动画
    bodyAnimation() {
      let lineH = this.$panel.tableContentHeight.value
      typeof lineH === 'string' && (lineH = ~~lineH)
      lineH = lineH + 1
      // const speed = 20 // 滚动的速度
      const speed = ~~this.tableScrollTimeSet // 滚动的速度
      // const speed = Math.floor(~~this.tableScrollTimeSet * 1000 / lineH) // 滚动的速度
      // console.log(speed, 'speed')
      const delay= ~~this.tableScrollTimeStop * 1000
      const vm = this
      function startScroll() {
        vm.tabelTime = setInterval(scrollUp, speed)
        vm.translateY = vm.translateY + 1
        vm.styleTranform = `transform: translateY(-${vm.translateY}px)`
      }
      function scrollUp() {
        if(Math.floor(vm.translateY % lineH) === 0) {
          clearInterval(vm.tabelTime)
          vm.tabelTime = null
          vm.tabelTimeDelay = setTimeout(startScroll, delay)
        } else {
          vm.translateY = vm.translateY + 1
          vm.styleTranform = `transform: translateY(-${vm.translateY}px)`
          if (vm.translateY >= lineH * (vm.dataBody.length)) {
            vm.translateY = 0
            vm.styleTranform = `transform: translateY(-${vm.translateY}px)`
          }
        }
      }
      vm.tabelTimeDelay = setTimeout(startScroll, delay)
    },
    setHeadData() {
      this.dataHead = []
      if (this.isEventTabel) {
        this.eventHeadData.parentId = this.eventParentId
        this.eventHeadData.cloneTimeName = this.eventCloneName
        this.eventHeadData.statusName = this.eventStatusName
        this.eventHeadData.parentIdSign = this.mapData.head.findIndex(item => item === this.eventHeadData.parentId)
        this.eventHeadData.cloneTimeSign = this.mapData.head.findIndex(item => item === this.eventHeadData.cloneTimeName)
        this.eventHeadData.statusNameSign = this.mapData.head.findIndex(item => item === this.eventHeadData.statusName)
      }
      this.mapData.head.map(item => {
        let obj = {
          value: item
        }
        this.contentWidth[obj.value] && (obj.width = this.contentWidth[obj.value])
        if (this.isEventTabel) {
          item !== this.eventHeadData.parentId && item !== this.eventHeadData.cloneTimeName && this.dataHead.push(obj)
        } else {
          this.dataHead.push(obj)
        }
        // return obj
      })
    },
    dealEveryBodyData(item, index) {
      const objOut = {
        key: `data${keyId ++}`,
        value: []
      }
      item.map((itemInner, indexInner) => {
          // return itemInner
          let obj = {
            head: this.mapData.head[indexInner],
            value: itemInner,
            style: '',
            width: '',
            color: '#fff'
          }
          if(indexInner === 5 && itemInner === '未完成') {
            obj.color = 'red'
          }
          this.contentStyle[obj.head] && (obj.style = this.contentStyle[obj.head])
          this.contentWidth[obj.head] && (obj.width = this.contentWidth[obj.head])
          if (this.isEventTabel) {
            indexInner === this.eventHeadData.statusNameSign && item[this.eventHeadData.cloneTimeSign] && (obj.class = item[this.eventHeadData.cloneTimeSign] < this.eventHeadData.currentTime ? 'bigscreen-table__td-warning' : '')
            indexInner !== this.eventHeadData.parentIdSign && indexInner !== this.eventHeadData.cloneTimeSign && objOut.value.push(obj)
          } else {
            objOut.value.push(obj)
          }
        })
      this.isEventTabel && (objOut.class = this.eventHeadData.parentIdClass[item[this.eventHeadData.parentIdSign]])
      return objOut
    },
    returnData(num) {
      const a = []
      for (let i = 0; i < num; i++) {
        a.push(['AHU-Dwwq', `缺料${st}`, '501346ww4930', `4b${st}`,	'设计错误', '高梓健', '佛冈县粤华空调设备有限公司'])
        st++
      }
      return a
    },
    pushClick() {
      console.log(this.resffss.data.data)
      // this.resffss.data.data = this.resffss.data.data.filter((item, index) => {
      //   return index === 0 || index > 3
      // })
      // console.log(this.resffss.data.data)
      this.resffss.data.data = this.resffss.data.data.concat(this.returnData(4))
      this.initComponentsData(this.resffss, true)
    },
  },
  // NOTE: setting 字段建议不要删除
  setting
}


</script>

<style lang="less" scoped>
  .bigscreen-table {
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    // background-color: #00003f;
    &__box  {
      width: 100%;
      table-layout:fixed;
    }
    &__head {
      background-image: linear-gradient(#1f74b4, #1869b4);
      font-size: 12px;
      font-weight: normal;
      display: flex;
      list-style: none;
      li {
        color: #d7f7ff;
        text-align: center;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        padding: 0 5px;
      }
    }
    &__new  {
      display: inline-block;
      width: 18px;
      height: 18px;
      position: absolute;
      top: 50%;
      margin-left: 4px;
      transform: translateY(-59%);
      img {
        width: 100%;
        height: 100%;
      }
    }
    &__flex {
      flex: 1;
    }

    &__tr{
      box-sizing: border-box;
      background-image: none;
      border-bottom: 1px solid transparent;
      &&-bm {
        background-image: linear-gradient(#052668, #0e387e);
        border-bottom: 1px solid #065e9e;
      }
      line-height: 26px;
      font-size: 12px;
      font-weight: normal;
      display: flex;
      list-style: none;
      li {
        color: #bdf2ff;
        font-size: 13px;
        text-align: center;
        align-content: center;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        position: relative;
        padding: 0 5px;
      }
    }
    &__tr:nth-child(2n) {
      background-image: none;
      border-bottom: 1px solid transparent;
    }
    &__tr&__tr-bm:nth-child(2n) {
      background-image: none;
      border-bottom: 1px solid transparent;
    }
    & &__tr&__tr-warning {
      background-image: linear-gradient(#2d1249, #511747);
      box-shadow: 0px 0px 2px #ff5159 inset;
      border-bottom: 1px solid #ff5159;
    }

    &__body-third {
      .bigscreen-table__tr{
        background-image: none;
        // background-color: #00003f;
        border-bottom: 1px solid transparent;
      }
      .bigscreen-table__tr:nth-child(2n) {
        background-image: linear-gradient(#052668, #0e387e);
        border-bottom: 1px solid #065e9e;
      }
    }

    &__body-no-third {
      .bigscreen-table__tr{
        background-image: none;
        // background-color: #00003f;
        border-bottom: 1px solid transparent;
      }
      .bigscreen-table__tr:nth-child(2n) {
        background-image: linear-gradient(#052668, #0e387e);
        border-bottom: 1px solid #065e9e;
      }
    }

    // 驱动未完成列表
    & &__td-warning {
      color: #ff5159;
    }
    & &__tr&__tr-event-one {
      background-image: none;
      border-bottom: 1px solid transparent;
    }
    & &__tr&__tr-event-two {
      background-image: linear-gradient(#052668, #0e387e);
      border-bottom: 1px solid #065e9e;
    }

    &__content {
      overflow: hidden;
      width: 100%;
      position: relative;
      transition: all .5s;
      // 不能去掉
      will-change: transform;
    }
    &__content-auto {
      overflow-x: hidden;
      overflow-y: scroll;
      -ms-overflow-style: none; 
      overflow: -moz-scrollbars-none;
      &::-webkit-scrollbar {
        display: none;
      }
      &::-webkit-scrollbar { width: 0 !important }
    }
    &__body {
      overflow: hidden;
    }

    
    &__text{
      display: inline-block;
      width: 100%;
    }
    &__empty {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d7f7ff;
      font-size: 14px;
    }
    .list-complete-item {
      transition: all .5s ease-in-out;
    }
    .list-complete-enter-active {
      transition: all .7s ease-in-out;
    }
    .list-complete-leave-active {
      transition: all .3 ease-in-out;
    }
    .list-complete-enter /* .fade-leave-active below version 2.1.8 */ {
      transform: translateY(-10%) translateX(3%);
      opacity: .5;
    }
  }
</style>
