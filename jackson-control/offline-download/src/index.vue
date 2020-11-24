<template>
  <div class="offline-download">
    <div v-if="useDatepicker" class="offline-download__row">
      <label class="offline-download__label">
        {{ datePickerLabel }}：
      </label>
      <el-date-picker
        v-model="dateArr"
        size="mini"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        class="offline-download__date-picker"
        popper-class="offline-download__date-picker-popup"
        style="width: 270px;"
      />
      <i
        :class="loading ? 'el-icon-loading' : 'ds-icon-down'"
        @click="downloadDatepicker"
      />
    </div>
    <div v-if="useYearMonth" class="offline-download__row">
      <label class="offline-download__label">
        {{ yearMonthLabel }}：
      </label>
      <el-select v-model="selectedYear" size="mini" class="select-1" popper-class="offline-select-popper">
        <el-option
          v-for="year in yearOptions"
          :key="year"
          :label="year"
          :value="year"
        />
      </el-select>
      <el-select v-model="selectedMonth" size="mini" class="select-2" popper-class="offline-select-popper">
        <el-option
          v-for="month in monthOptions"
          :key="month"
          :label="month"
          :value="month"
        />
      </el-select>
      <i
        :class="monthYearLoading ? 'el-icon-loading' : 'ds-icon-down'"
        @click="downloadMonthYear"
      />
    </div>
    <div v-if="graphKey === 'INVENTORY_AGING_ANALYSIS'" class="offline-download__row">
      <label class="offline-download__label">
        库存数据/库存明细：
      </label>
      <el-input
        :value="formatDate(Date.now(), true)"
        :readonly="true"
        size="mini"
        class="offline-input"
        style="width: 270px;"
      />
      <i
        :class="secondLoading ? 'el-icon-loading' : 'ds-icon-down'"
        @click="downloadKucun"
      />
    </div>
  </div>
</template>

<script>
import setting from './setting'
import monthYearMixin from './month-year-mixin'

export default {
  name: 'offline-download',
  mixins: [monthYearMixin],
  props: ['val'],
  setting,
  data() {
    return {
      firstLineLabel: '数据下载',
      secondLineLabel: '啦啦啦',
      dateArr: [],
      accountId: '',
      loading: false,
      secondLoading: false,
    }
  },
  computed: {
    apiPrefix() {
      return this.val.config.find(_ => _.key === 'api').items[0].value || 'http://jsonctr.dev.datastory.com.cn'
    },
    downloadBtnText() {
      return this.loading ? '处理中...' : '明细下载'
    },
    graphKey() {
      const bi = this.val.config.find(_ => _.key === 'bi').items.find(_ => _.value)
      return bi ? bi.key : ''
    },
    useDatepicker() {
      return [
        'MONTH_UNIT_PICKUP_RATE',
        'ENTRY_EXIT_COMPARISON',
        'SALES_TREND',
        'FINISHED_PRODUCT_OUTPUT',
        'INCREASINIG_TREND_OF_ORDERS_IN_HAND'
      ].includes(this.graphKey)
    },
    datePickerLabel() {
      if (this.graphKey === 'INCREASINIG_TREND_OF_ORDERS_IN_HAND') {
        return '台数下载'
      }
      return '数据下载'
    }
  },
  mounted() {
    try {
      const json = JSON.parse(localStorage.getItem('matrix_accountInfo'))
      this.accountId = json.accountMsg.accountId
    } catch (err) {
      this.accountId = 'none'
    }
  },
  methods: {
    initComponentsData(data) {
    },
    formatDate(value, onlyDate = false, isDayEnd = false) {
      if (value) {
        const date = new Date(value)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hour = date.getHours().toString().padStart(2, '0')
        const min = date.getMinutes().toString().padStart(2, '0')
        const sec = date.getSeconds().toString().padStart(2, '0')
        return onlyDate
          ? `${year}-${month}-${day}`
          : isDayEnd ? `${year}-${month}-${day} 23:59:59` : `${year}-${month}-${day} ${hour}:${min}:${sec}`
      }
      return value
    },
    getDateRange() {
      return {
        from: this.formatDate(this.dateArr[0]),
        to: this.formatDate(this.dateArr[1], false, true)
      }
    },
    downloadDatepicker() {
      if (this.loading) return

      if (this.dateArr.length !== 2) {
        this.$message.error('必须选择时间范围')
        return
      }
      this.requestDownload()
    },
    async requestDownload() {
      const graphKey = this.graphKey
      if (!graphKey) {
        return
      }

      const conditionJson = []
      switch (graphKey) {
        case 'MONTH_UNIT_PICKUP_RATE':
          conditionJson.push({
            field: 'gr_date',
            dateRange: this.getDateRange()
          })
          break
        case 'ENTRY_EXIT_COMPARISON':
          conditionJson.push({
            field: 'posting_date',
            dateRange: this.getDateRange()
          })
          break
        case 'SALES_TREND':
          conditionJson.push({
            field: 'goods_issue_date',
            dateRange: this.getDateRange()
          })
          break
        case 'FINISHED_PRODUCT_OUTPUT':
          conditionJson.push({
            field: 'actual_finish_time',
            dateRange: this.getDateRange()
          })
          break
        case 'INCREASINIG_TREND_OF_ORDERS_IN_HAND':
          conditionJson.push({
            field: 'document_date',
            dateRange: this.getDateRange()
          })
          break
      }

      // 添加下钻参数
      const savedChartFilters = this.$parent.$parent.savedChartFilters
      const tableUUID = this.$store.state.widgets.find(_ => _.title === 'detailTable').uuid
      const filters = savedChartFilters[tableUUID]
      const getParam = (value) => {
        if (value === '[]' || Array.isArray(value) || !value) {
          return ''
        }
        return value
      }

      conditionJson.push({
        field: 'pbu',
        termValue: getParam(filters['pbu'])
      })
      conditionJson.push({
        field: 'product_group',
        termValue: getParam(filters['product_group'])
      })
      conditionJson.push({
        field: 'product_model',
        termValue: getParam(filters['product_model'])
      })

      console.log('请求 json', conditionJson)

      const params = {
        graphKey,
        conditionJson: JSON.stringify(conditionJson),
        accountId: this.accountId
      }
      console.log('请求参数', params)

      this.loading = true
      const res = await this.sendAjax(params)
      this.loading = false
      if (res.success) {
        this.$message.success(res.message)
      } else {
        this.$message.error(res.message)
      }
    },
    // 库存账龄分析的第二个下载接口
    async downloadKucun() {
      if (this.secondLoading) return

      const promises = []
      const today = this.formatDate(Date.now(), true)
      const params1 = {
        graphKey: 'CURRENT_INVENTORY',
        conditionJson: JSON.stringify([{
          field: 'warehouse_out_date_date_format',
          dateRange: {
            from: today,
            to: ''
          }
        }, {
          field: 'warehouse_in_date_date_format',
          dateRange: {
            from: '',
            to: today
          }
        }]),
        accountId: this.accountId
      }
      const params2 = {
        graphKey: 'INVENTORY_DETAILS',
        conditionJson: JSON.stringify([]),
        accountId: this.accountId
      }

      console.log('请求参数', params1, params2)

      promises.push(this.sendAjax(params1), this.sendAjax(params2))
      this.secondLoading = true
      const result = await Promise.all(promises)
      this.secondLoading = false
      if (result.every(_ => _.success)) {
        this.$message.success(result[0].message)
      } else if (!result[0].success) {
        this.$message.error(result[0].message)
      } else if (!result[1].success) {
        this.$message.error(result[1].message)
      }
    },
    sendAjax(params) {
      return new Promise(resolve => {
        $.ajax({
          url: `${this.apiPrefix}/serv/download/offline/job`,
          type: 'get',
          dataType: 'json',
          data: params,
          success: res => {
            resolve(res)
          }
        })
      })
    }
  }
}

</script>

<style lang="less">
@import './less/datetime';

.offline-download {
  height: 100%;
  box-sizing: border-box;
  &__row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    & > i {
      font-size: 20px;
      color: rgb(4, 124, 255);
      cursor: pointer;
      margin-left: 10px;
      &.el-icon-loading {
        cursor: not-allowed;
      }
    }
  }

  &__label {
    font-size: 14px;
    color: rgb(4, 124, 255);
    width: 150px;
    text-align: right;
  }

  &__date-picker {
    .c-el-datetime();
    margin-left: 5px;
  }

  &__date-picker-popup {
    .c-el-datetime__popup();
  }

  .select-1 {
    margin-right: 10px;
    width: 130px;
  }
  .select-2 {
    width: 130px;
  }

  .select-1, .select-2, .offline-input {
    .el-input__inner {
      background-color: rgb(0, 9, 60);
      color: rgba(4, 124, 255, 1);
      border-color: rgba(4, 124, 255, 1);
    }
  }
}

.offline-select-popper {
  margin: 0;
  border-color: rgba(4, 124, 255, 1);

  .el-select-dropdown__wrap {
    background-color: rgb(0, 9, 60) !important;
  }

  .el-select-dropdown {
    background-color: rgb(0, 9, 60) !important;
    border-color: rgba(4, 124, 255, 1);
  }

  .el-select-dropdown__list > .el-select-dropdown__item {
    padding: 0 12px;
    font-size: 13px;
    color: rgba(4, 124, 255, 1);
    height: 28px;
    line-height: 28px;
    margin: 2px 0;
    background-color: rgb(0, 9, 60) !important;
  }

  .el-select-dropdown__item:hover,
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item.selected.hover {
    color: #5CC8FF !important;
    background-color: #151E40 !important;
  }
}
</style>
