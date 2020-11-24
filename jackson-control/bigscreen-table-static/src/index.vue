<template>
  <div class="bigscreen-table-static">
    <template>
      <ul class="bigscreen-table-static__head" v-if="!isDefaultHeadData || (isDefaultHeadData && defaultHeadData.length > 0)">
        <li v-for="(item, index) in dataHead" :key="index" :class="{'bigscreen-table-static__flex': !item.width}" :style="`${item.width ? item.width : ''} line-height: ${headHight}; ${headeStyle}`">
          {{ item.value }}
        </li>
      </ul>

      <div ref="bodyBox" class="bigscreen-table-static__content" v-if="!isEmpty">
        <!-- 当bigscreen-table__body中的高度大于能显示滚动的醉倒高度时才能具有动画效果 -->
        <!-- :class="{'bigscreen-table-static__tr-warning': isShowWarning && item.value[warningIndex].value === warningValue}" -->
        <div ref="body" class="bigscreen-table-static__body">
          <ul
            class="bigscreen-table-static__tr"
            v-for="(item, index) in dataBody"
            :key="index">
            <li
              v-for="(itemInner, indexInner) in item.value"
              :key="indexInner"
              :class="{'bigscreen-table-static__flex': !itemInner.width, 'bigscreen-table-static__td-warning': isShowWarning && itemInner.value === warningValue, 'bigscreen-table-static__point': emitHead.includes(itemInner.head)}"
              :style="`${itemInner.width ? itemInner.width : ''} ${itemInner.style} line-height: ${lineHeight};`"
              @click="emitEvent(itemInner)">
              {{ itemInner.value }}
            </li>
          </ul>
        </div>
      </div>
    </template>
    <div v-if="isEmpty" class="bigscreen-table-static__empty" :style="`height: calc(100% - ${headHight})`">
      暂无数据
    </div>
  </div>
</template>

<script>
import setting from './setting'
import mixin from './mixin'
export default {
  name: 'bigscreen-table-static',
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
    // 头部的lineheight，即头部的高度
    headHight() {
      return '26px'
    },
    // 内容中的行高，默认为20
    lineHeight() {
      return `${this.$panel.tableContentHeight.value || 20}px`
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
    warningKey() {
      return this.$panel.dataSettingPrimary.value.split('=')[0]
      // return '状态'
    },
    warningValue() {
      return this.$panel.dataSettingPrimary.value.split('=')[1]
      // return '排休'
    },
    isShowWarning() {
      return true
    },
    // 固定表头数据
    isDefaultHeadData() {
      return this.$panel.isDefaultHeadData.value
    },
    defaultHeadData() {
      if (this.$panel.defaultHeadData) {
        const str = this.$panel.defaultHeadData.value.replace(/[\r\n]/g,"")
        return str.split(',')
      }
      return []
    }
  },
  data() {
    return {
      isEmpty: true,
      mapData: {
      },

      dataHead: [],
      dataBody: [],
      warningIndex: null,
      // 联动的头部数据（以列为数据）
      // emitHead: 'COIL生产线'
      emitHead: ['COIL生产线', '组装生产线']
    }
  },
  methods: {
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
      if (this.isDefaultHeadData && this.defaultHeadData.length > 0) {
        this.mapData.head = this.defaultHeadData
        this.setHeadData()
      }
      if (!res || !res.data || !res.data.data || !res.data.data.length) {
        this.isEmpty = true
      } else {
        this.isEmpty = false
        const data = [...res.data.data]
        // 获取第一行的数据为表头，其余为表内容
        !this.isDefaultHeadData && (this.mapData.head = data[0])
        this.mapData.body = data.slice(1);
        // 获取第一行的数据为表头，其余为表内容
        const bodyMap = data.slice(1).map(this.dealEveryBodyData);

        !this.isDefaultHeadData && this.setHeadData()
        this.dataBody = bodyMap
        this.isShowWarning && this.getWarningIndex()
      }
    },
    getWarningIndex() {
      this.warningIndex = this.mapData.head.findIndex(item => item === this.warningKey)
    },
    setHeadData() {
      this.dataHead = this.mapData.head.map(item => {
        let obj = {
          value: item
        }
        this.contentWidth[obj.value] && (obj.width = this.contentWidth[obj.value])
        return obj
      })
    },
    dealEveryBodyData(item, index) {
      const objOut = {
        value: item.map((itemInner, indexInner) => {
          // return itemInner
          let obj = {
            head: this.mapData.head[indexInner],
            value: itemInner,
            style: '',
            width: ''
          }
          this.contentStyle[obj.head] && (obj.style = this.contentStyle[obj.head])
          this.contentWidth[obj.head] && (obj.width = this.contentWidth[obj.head])
          return obj
        })
      }
      return objOut
    },
    emitEvent(item) {
      if (!this.emitHead.includes(item.head)) {
        return false
      }
      this.$emit('emitDimensions', {
        uuid: this.val.uuid,
        '产线': item.value
      })
    }
  },
  // NOTE: setting 字段建议不要删除
  setting
}

</script>

<style lang="less">
  .bigscreen-table-static {
    height: 100%;
    box-sizing: border-box;
    &__point {
      cursor: pointer;
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
      }
    }
    &__flex {
      flex: 1;
    }
    &__content {
      overflow: hidden;
      width: 100%;
      position: relative;
      height: calc(100% - 26px);
      overflow-x: hidden;
      overflow-y: scroll;
      -ms-overflow-style: none; 
      overflow: -moz-scrollbars-none;
      &::-webkit-scrollbar {
        display: none;
      }
      &::-webkit-scrollbar { width: 0 !important }
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
      // height: 100%;
      // width: 100%;
      overflow: hidden;
    }
    &__tr{
      box-sizing: border-box;
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
      }
    }
    &__tr:nth-child(2n) {
      background-image: linear-gradient(#052668, #0e387e);
      border-bottom: 1px solid #065e9e;
    }
    & &__tr&__tr-warning {
      background-image: linear-gradient(#2d1249, #511747);
      box-shadow: 0px 0px 2px #ff5159 inset;
      border-bottom: 1px solid #ff5159;
    }
    &__td-warning {
      color: #ff5159 !important;
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
  }
</style>
