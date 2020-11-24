<template>
  <div class="operate-drill-table">
    <div class="operate-drill-table__top">
      <div
        class="operate-drill-table__filter-btn"
        :class="status === 0 ? 'active' : ''"
        @click.stop="onStatusClick(0)"
      >
        未关闭
      </div>
      <div
        class="operate-drill-table__filter-btn"
        :class="status === 1 ? 'active' : ''"
        @click.stop="onStatusClick(1)"
      >
        已关闭
      </div>
    </div>

    <div class="operate-drill-table__follow-table-title">
      跟进记录
    </div>
    <div class="operate-drill-table__file-table-title">
      附件列表
    </div>

    <div class="operate-drill-table__event-table">
      <transition name="loading">
        <div v-show="eventLoading" class="operate-drill-table__loading">
          <div class="operate-drill-table__loading-text">LOADING</div>
          <div class="operate-drill-table__loading-box loading-theme-7" />
        </div>
      </transition>
      <div v-if="!eventNoData" class="operate-drill-table__table">
        <div class="operate-drill-table__head">
          <div
            v-for="(item, index) in eventTableHead"
            :key="item.name"
            :class="mainHeadClass(item)"
            :style="mainHeadStyle(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="operate-drill-table__body">
          <div
            v-for="(item, index) in eventSlice"
            :key="index"
            class="operate-drill-table__tr"
          >
            <div class="operate-drill-table__index">
              {{ index + 1 }}
            </div>
            <div class="operate-drill-table__flex" :title="item.taskName">
              {{ item.taskName }}
            </div>
            <div
              :title="item.parentDesc"
              :style="parentDescStyle"
            >
              {{ item.eventDesc }}
            </div>
            <div
              class="operate-drill-table__hover"
              :title="item.taskDesc"
              :style="childDescStyle"
              @click.stop="onTaskClick(item)"
            >
              {{ item.taskDesc }}
            </div>
            <div class="operate-drill-table__flex">
              {{ item.createName }}
            </div>
            <div class="operate-drill-table__flex">
              {{ item.status | formatStatus }}
            </div>
            <div class="operate-drill-table__flex">
              {{ item.executorDepartment }}
            </div>
            <div class="operate-drill-table__flex">
              {{ item.executorName }}
            </div>
            <div class="operate-drill-table__flex">
              {{ item.createTime | formatDate }}
            </div>
            <div class="operate-drill-table__flex">
              {{ item.reviewTime | formatDate }}
            </div>
            <div class="operate-drill-table__flex">
              {{ item.planTime | formatDate}}
            </div>
          </div>
        </div>
      </div>
      <div v-if="!eventNoData" class="operate-drill-table__pagination">
        <el-pagination
          layout="prev, pager, next"
          :current-page.sync="currentPage"
          :total="total"
        />
      </div>
      <div v-if="eventNoData" class="operate-drill-table__no-data">
        抱歉，暂无数据
      </div>
    </div>

    <div class="operate-drill-table__follow-table">
      <transition name="loading">
        <div v-show="followLoading" class="operate-drill-table__loading">
          <div class="operate-drill-table__loading-text">LOADING</div>
          <div class="operate-drill-table__loading-box loading-theme-7" />
        </div>
      </transition>
      <div v-if="!followNoData" class="operate-drill-table__table" style="height: 100%;">
        <div class="operate-drill-table__head">
          <div
            v-for="(item, index) in followTableHead"
            :key="item.name"
            :class="!item.width ? 'operate-drill-table__flex': ''"
            :style="item.width ? { flexBasis: `${item.width}px` } : {}"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="operate-drill-table__body">
          <el-scrollbar ref="scroll" :style="{ height: '100%' }">
            <div
              v-for="(item, index) in followTableBody"
              :key="index"
              class="operate-drill-table__tr"
            >
              <div class="operate-drill-table__index">
                {{ index + 1 }}
              </div>
              <div style="flex-basis: 85px;">
                {{ item.creatorName }}
              </div>
              <div class="operate-drill-table__flex" :title="item.remark">
                {{ item.remark }}
              </div>
              <div style="flex-basis: 85px;">
                {{ item.createTime | formatDate }}
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div v-if="followNoData" class="operate-drill-table__no-data">
        抱歉，暂无数据
      </div>
    </div>

    <div class="operate-drill-table__file-table">
      <transition name="loading">
        <div v-show="fileLoading" class="operate-drill-table__loading">
          <div class="operate-drill-table__loading-text">LOADING</div>
          <div class="operate-drill-table__loading-box loading-theme-7" />
        </div>
      </transition>
      <div v-if="!fileNoData" class="operate-drill-table__table" style="height: 100%;">
        <div class="operate-drill-table__head">
          <div
            v-for="(item, index) in fileTableHead"
            :key="item.name"
            :class="!item.width ? 'operate-drill-table__flex': ''"
            :style="item.width ? { flexBasis: `${item.width}px` } : {}"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="operate-drill-table__body">
          <el-scrollbar ref="scroll" :style="{ height: '100%' }">
            <div
              v-for="(item, index) in fileTableBody"
              :key="index"
              class="operate-drill-table__tr"
            >
              <div class="operate-drill-table__index">
                {{ index + 1 }}
              </div>
              <div style="flex-basis: 85px;">
                {{ item.uploadByName }}
              </div>
              <div
                class="operate-drill-table__flex operate-drill-table__hover"
                @click.stop="downloadFile(item)"
              >
                {{ item.fileName }}
              </div>
              <div style="flex-basis: 85px;">
                {{ item.uploadTime | formatDate }}
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div v-if="fileNoData" class="operate-drill-table__no-data">
        抱歉，暂无数据
      </div>
    </div>
  </div>
</template>

<script>
import eventMixin from './mixins/event-mixin'

const statusMap = {
  0: '新建',
  1: '完成',
  2: '取消',
  3: '关闭',
  4: '处理中'
}

function formatDate(value) {
  if (value) {
    const date = new Date(value)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  return value
}

function formatStatus(value) {
  return statusMap[value]
}

export default {
  name: 'operate-drill-table',
  props: ['val'],
  mixins: [eventMixin],
  computed: {
    prefix() {
      return this.val.config.find(_ => _.key === 'dev').items[0].value
        || 'http://jsonctr.dev.datastory.com.cn'
    },
    parentDescStyle() {
      const item = this.val.config.find(_ => _.key === 'style').items[0]
      return {
        flexBasis: `${item.value}px`
      }
    },
    childDescStyle() {
      const item = this.val.config.find(_ => _.key === 'style').items[1]
      return {
        flexBasis: `${item.value}px`
      }
    }
  },
  filters: {
    formatDate,
    formatStatus
  },
  methods: {
    initComponentsData(params) {
    },
    mainHeadClass(item) {
      switch (item.name) {
        case '父事件描述':
        case '子事件描述':
        case '序号':
          return ''
        default: {
          return 'operate-drill-table__flex'
        }
      }
    },
    mainHeadStyle(item) {
      switch (item.name) {
        case '父事件描述':
          return this.parentDescStyle
        case '子事件描述':
          return this.childDescStyle
        case '序号':
          return { flexBasis: '50px' }
        default: {
          return {}
        }
      }
    },
    // 下载文件
    downloadFile(item) {
      var xhr = new XMLHttpRequest()
      let url = `${this.prefix}/file/download/${item.id}`
      xhr.open('GET', url, true)
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
      xhr.setRequestHeader('Token', this.token)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        var blob = this.response
        let a = document.createElement('a')
        a.setAttribute('class', 'dowmLoadExample')
        a.download = item.fileName
        a.href = window.URL.createObjectURL(blob)
        a.click()
      }
      xhr.send()
    },
    onTaskClick(item) {
      this.searchFollowList(item.taskRecordId)
      this.searchFileList(item.taskRecordId)
    },
    onStatusClick(status) {
      if (this.status !== status) {
        this.status = status
        this.currentPage = 1
        this.searchEventList()
      }
    }
  },
  setting: {
    title: '驱动运营下钻表格',
    version: 2,
    config: [{
      name: '开发配置',
      key: 'dev',
      items: [{
        label: 'URL prefix',
        type: 'panel-input',
        value: '/jsonctrmgt'
      }]
    }, {
      name: '样式配置',
      key: 'style',
      items: [{
        label: '父事件描述宽度',
        type: 'panel-input-number',
        value: 200
      }, {
        label: '子事件描述宽度',
        type: 'panel-input-number',
        value: 200
      }]
    }]
  }
}

</script>

<style lang="less">
@import './less/filter';

@top-height: 40px;
@label-height: 30px;
@pagination-height: 45px;

@event-table-height: 400px;

.operate-drill-table {
  height: 100%;
  box-sizing: border-box;
  position: relative;

  &__top {
    height: @top-height;
    color: #fff;
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &__event-table {
    position: absolute;
    top: @top-height;
    left: 0;
    right: 0;
    height: @event-table-height;
  }

  &__follow-table {
    position: absolute;
    left: 0;
    bottom: 0;
    height: calc(100% - @top-height - @label-height - @event-table-height);
    width: calc(60% - 10px);
  }

  &__file-table {
    position: absolute;
    right: 0;
    bottom: 0;
    height: calc(100% - @top-height - @label-height - @event-table-height);
    width: calc(40% - 10px);
  }

  &__follow-table-title {
    position: absolute;
    left: 0;
    bottom: calc(100% - @top-height - @label-height - @event-table-height);
    height: @label-height;
    font-size: 14px;
    color: #D7F7FF;
  }

  &__file-table-title {
    position: absolute;
    left: calc(60% + 10px);
    bottom: calc(100% - @top-height - @label-height - @event-table-height);
    height: @label-height;
    font-size: 14px;
    color: #D7F7FF;
  }

  // Loading Style
  &__loading {
    position: absolute;
    top: 0;
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

  &__no-data {
    position: absolute;
    top: 0;
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

  &__table {
    height: calc(100% - @pagination-height);
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

  &__index {
    flex-basis: 50px;
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
      line-height: 30px;
      text-align: center;
      align-content: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
    }
  }

  &__tr:nth-child(2n) {
    background-image: linear-gradient(#052668, #0e387e);
    border-bottom: 1px solid #065e9e;
  }

  &__tr:nth-child(2n + 1) {
    background-color: #000635;
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

  &__hover {
    &:hover {
      color: #7dbf42;
      cursor: pointer;
    }
  }
}

// 下载对话框样式
.operate-new-table {
  &__dialog {
    .el-dialog__body {
      padding-bottom: 20px;
    }
  }

  &__export {
    height: 300px;
    overflow: auto;

    &-no {
      margin-top: 100px;
      text-align: center
    }

    ul {
      padding-bottom: 20px;

      li {
        font-size: 13px;
        line-height: 30px;
        border: 1px solid #ccc;
        padding: 0 10px;
        padding-right: 120px;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      li + li {
        margin-top: 10px;
      }
    }

    &-icon {
      position: absolute;
      right: 60px;
      top: 0;
      line-height: 30px;
      cursor: pointer;
      color: #2cbcb1;
    }

    &-icon-again {
      position: absolute;
      right: 10px;
      top: 0;
      line-height: 30px;
      cursor: pointer;
      color: #2cbcb1;
    }

    &-icon:hover, &-icon-again:hover {
      color: #56c9c1;
    }
  }
}
</style>
