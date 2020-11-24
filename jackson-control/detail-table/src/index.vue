<template>
  <div class="detail-table">
    <transition name="loading">
      <div v-show="loading" class="detail-table__loading">
        <div class="detail-table__loading-text">LOADING</div>
        <div class="detail-table__loading-box loading-theme-7" />
      </div>
    </transition>
    <div v-if="!noData" class="detail-table__top">
      <el-button
        v-if="showDownloadBtn"
        class="detail-table__top-download"
        icon="el-icon-download"
        size="mini"
        @click="onDownloadData"
      >
        数据下载
      </el-button>
    </div>
    <div v-if="!noData" class="detail-table__table">
      <div class="detail-table__head">
        <div v-if="$panel.showIndex.value" :style="indexHeadStyle">序号</div>
        <div
          v-for="(item, index) in filterDataHead"
          :key="index"
          :class="{'detail-table__flex': !item.width}"
          :style="`${item.width ? item.width : ''} line-height: ${headHeight};`">
          {{ item.displayValue }}
        </div>
      </div>

      <div
        class="detail-table__body"
        :style="isLeadtime ? { height: 'calc(100% - 52px)' } : {}"
      >
        <el-scrollbar ref="scroll" :style="{ height: '100%' }">
          <div
            :class="['detail-table__tr']"
            v-for="(item, index) in dataBody"
            :key="index"
          >
            <div
              v-if="$panel.showIndex.value"
              :style="indexContentStyle"
              :class="{ hover: isIndexClickable }"
              @click.stop="onItemClick({ head: '#', value: index }, item)"
            >
              {{ index + 1 }}
            </div>
            <div
              v-for="(itemInner, indexInner) in filterColumn(item.value)"
              :key="indexInner"
              :class="[{ 'detail-table__flex': !itemInner.width }, itemInner.class]"
              :style="`${itemInner.width ? itemInner.width : ''} ${itemInner.style} line-height: ${lineHeight};`"
              @click.stop="onItemClick(itemInner, item)"
            >
              {{ itemInner.value }}
            </div>
          </div>
        </el-scrollbar>
      </div>

      <div v-if="isLeadtime && leadtimeBody.length > 0" class="detail-table__fix-row detail-table__tr">
        <div :style="indexContentStyle"></div>
        <div
          v-for="(itemInner, indexInner) in filterColumn(leadtimeBody[0].value)"
          :key="indexInner"
          :class="[{ 'detail-table__flex': !itemInner.width }, itemInner.class]"
          :style="`${itemInner.width ? itemInner.width : ''} ${itemInner.style} line-height: ${lineHeight};`"
        >
          {{ itemInner.value }}
        </div>
      </div>
    </div>
    <div v-if="!noData" class="detail-table__pagination">
      <el-pagination
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="onPageChange"
      />
    </div>
    <div v-if="noData" class="detail-table__no-data">
      抱歉，暂无数据
    </div>
  </div>
</template>

<script>
import setting from './setting'
import panelMixin from '../../../common/panel-mixin'
import { debounce } from '../../../common/utils'
import tableStyleMixin from './tableStyleMixin'
import cellClickMixin from './bi-mixins/cellClickMixin'
import computedMixin from './bi-mixins/computedMixin'
import clickableMixin from './bi-mixins/clickableMixin'
import preprocessMixin from './bi-mixins/preprocessMixin'
import downloadMixin from './bi-mixins/downloadMixin'
import { BI_TYPES } from './bi-mixins/biType'

export default {
  name: 'detail-table',
  props: ['val'],
  mixins: [
    panelMixin,
    tableStyleMixin,
    cellClickMixin,
    computedMixin,
    clickableMixin,
    preprocessMixin,
    downloadMixin
  ],
  data() {
    return {
      // 是否正在加载
      loading: true,
      dataHead: [],
      dataBody: [],
      mapData: {},
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchText: '',
      aliasMap: {},
      colAliasMap: {},
      leadtimeBody: [],
      noData: false,
      downloadData: {},
      reservePage: false
    }
  },
  computed: {
    headHeight() {
      return `${this.$panel.tableHeadHeight.value || 26}px`
    },
    lineHeight() {
      return `${this.$panel.tableContentHeight.value || 20}px`
    },
    indexContentStyle() {
      return {
        width: '70px',
        lineHeight: this.lineHeight,
      }
    },
    indexHeadStyle() {
      return {
        width: '70px',
        lineHeight: this.headHeight
      }
    },
    contentStyle() {
      return this.parseTableContentStyle() || {}
    },
    contentWidth() {
      return this.parseTableColumnStyle() || {}
    },
    downloadFileName() {
      return this.$panel.downloadFileName.value
    },
    filterDataHead() {
      if (this.isLeadtime) {
        return this.dataHead.filter(_ => !_.value.endsWith('[标准]'))
      }
      return this.dataHead
    }
  },
  methods: {
    initComponentsData(params) {
      console.log('调用 initComponentsData:', params)
      if (params.index === 0) {
        this.loading = false
        if (!params || !params.data || !params.data.data || params.data.data.length === 0) {
          this.noData = true
          return
        }

        this.aliasMap = params.aliasMap || {}
        this.colAliasMap = params.colAliasMap || {}

        const data = [...params.data.data]
        this.mapData.head = data[0]
        this.mapData.body = data.slice(1)
        this.preprocessData()

        if (this.isLeadtime) {
          this.leadtimeBody = this.mapData.body.slice(0, 1).map(this.dealEveryBodyData)
        }

        // 重置页码和总记录数
        if (this.reservePage) {
          if (this.mapData.body.length !== this.total) {
            this.currentPage = 1
          }
        } else {
          this.currentPage = 1
        }
        this.total = this.mapData.body.length

        this.setHeadData()
        this.onPageChange()
        this.noData = false
        this.reservePage = false
      } else {
        const downloadData = [...params.data.data]
        if (downloadData.length > 0) {
          for (let i = 0; i < downloadData[0].length; i++) {
            downloadData[0][i] = this.formatAliasHead(
              downloadData[0][i],
              params.colAliasMap || {},
              params.aliasMap || {}
            )
          }
        }
        this.downloadData[params.index] = downloadData
      }
    },
    // 索引别名格式化表头
    formatAliasHead(headName, colAliasMap, aliasMap) {
      if (colAliasMap[headName]) {
        return typeof colAliasMap[headName] === 'string'
          ? colAliasMap[headName]
          : colAliasMap[headName].alias
      }
      if (aliasMap[headName]) {
        return aliasMap[headName] === 'string'
          ? aliasMap[headName]
          : aliasMap[headName].alias
      }
      return headName
    },
    setHeadData() {
      this.dataHead = this.mapData.head.map(item => {
        const result = {
          value: item,
          displayValue: this.formatAliasHead(item, this.colAliasMap, this.aliasMap)
        }
        if (this.contentWidth[result.value]) {
          result.width = this.contentWidth[result.value]
        }
        return result
      })
    },
    onPageChange() {
      if (this.isLeadtime) {
        this.dataBody = this.mapData.body.slice(
          (this.currentPage - 1) * this.pageSize + 1,
          this.currentPage * this.pageSize + 1
        ).map(this.dealEveryBodyData)
      } else {
        this.dataBody = this.mapData.body.slice(
          (this.currentPage - 1) * this.pageSize,
          this.currentPage * this.pageSize
        ).map(this.dealEveryBodyData)
      }
    },
    dealEveryBodyData(item, index) {
      const objOut = {
        value: item.map((itemInner, indexInner) => {
          let obj = {
            head: this.mapData.head[indexInner],
            value: itemInner,
            style: '',
            width: ''
          }
          this.contentStyle[obj.head] && (obj.style = this.contentStyle[obj.head])
          this.contentWidth[obj.head] && (obj.width = this.contentWidth[obj.head])
          this.setCellClickable(obj)

          if (this.isLeadtime) {
            if (this.mapData.head[indexInner].match(/\d\d\-\d\d/) && itemInner > item[indexInner + 1] * 1.1) {
              obj.style += 'color: red;'
            }
          }
          return obj
        })
      }
      return objOut
    },
    filterColumn(columnArr) {
      if (this.isLeadtime) {
        return columnArr.filter(_ => !_.head.endsWith('[标准]'))
      }
      return columnArr
    }
  },
  setting
}

</script>

<style lang="less">
@top-height: 40px;
@pagination-height: 45px;

.detail-table {
  height: 100%;
  box-sizing: border-box;
  position: relative;

  &__no-data {
    position: absolute;
    height: calc(100% - @pagination-height - @top-height);
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    font-size: 14px;
    color: hsla(0, 0%, 60%, .6);
  }

  // Loading Style
  &__loading {
    position: absolute;
    height: calc(100% - @top-height);
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  &__loading-text {
    font-size: 12px;
    color: #eee;
    margin-bottom: 10px;
  }
  &__loading-box {
    width: 50px;
    height: 7px;
  }
  .loading-enter-active, .loading-leave-active {
    transition: opacity .3s;
  }
  .loading-enter, .loading-leave-to {
    opacity: 0;
  }

  &__top {
    height: @top-height;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  &__top-download, &__top-download:focus {
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    overflow: hidden;
    box-sizing: border-box;
    border-color: rgb(4, 124, 255);
    box-shadow: rgba(99, 114, 117, 0.24) 0px 0px 0px;
    background-color: rgba(255, 255, 255, 0);
    color: rgb(4, 124, 255);
    &:hover {
      border-color: rgb(4, 124, 255);
      box-shadow: rgba(99, 114, 117, 0.24) 0px 0px 0px;
      background-color: rgb(4, 124, 255);
      color: #fff;
    }
  }

  &__search-input {
    width: 250px;
    margin-right: 10px;
  }

  &__table {
    height: calc(100% - @pagination-height - @top-height);
  }

  &__pagination {
    height: @pagination-height;
    padding-right: 10px;
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
    .el-pagination {
      color: #bdf2ff;
      padding: 0;
      background-color: transparent;
      .el-pager li {
        min-width: 28px;
        margin: 0 4px;
        background-color: transparent;
      }
      .el-pager li:hover {
        background-color: rgba(#999, 0.15);
        border-radius: 4px;
        color: #7dbf42;
      }
      .el-pager li.active {
        color: #fff;
        background-color: #7dbf42;
        border-radius: 4px;
        cursor: default;
      }
      .btn-prev, .btn-next {
        color: #bdf2ff;
        background-color: transparent;
      }
    }
  }

  &__head {
    background-image: linear-gradient(#1f74b4, #1869b4);
    font-size: 12px;
    font-weight: normal;
    display: flex;
    & > div {
      color: #d7f7ff;
      text-align: center;
      line-height: 26px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &__flex {
    flex: 1;
  }
  &__body {
    width: 100%;
    position: relative;
    height: calc(100% - 26px);
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
  &__tr {
    box-sizing: border-box;
    font-size: 12px;
    font-weight: normal;
    display: flex;
    list-style: none;
    & > div {
      color: #bdf2ff;
      font-size: 13px;
      text-align: center;
      align-content: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      &.hover:hover {
        color: #7dbf42;
        cursor: pointer;
      }
    }
  }
  &__tr:nth-child(2n) {
    background-image: linear-gradient(#052668, #0e387e);
    border-bottom: 1px solid #065e9e;
  }
  &__tr:nth-child(2n + 1) {
    background-color: #000635;
  }
}
</style>
