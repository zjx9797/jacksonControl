import exportExcel from '../export-xlsx'
import { BI_TYPES } from './biType'
import { detailDownload, avgDayDetailDownload } from './detailDownload'

export default {
  methods: {
    onItemClick(item, row) {
      switch (this.biType) {
        case BI_TYPES.当月进仓机组提货率:
        case BI_TYPES.进仓与出仓对比:
        case BI_TYPES.销售趋势:
        case BI_TYPES.AOP完成率数量:
        case BI_TYPES.成品生产产出:
          this.onItemClickType1(item.head, item.value, row.value)
          break
        case BI_TYPES.在手订单新增趋势:
          this.onItemClickInHand(item.head, item.value, row.value)
          break
        case BI_TYPES.月平均计划达成率:
          this.onItemClickType3(item.head, item.value, row.value)
          break
        case BI_TYPES.leadtime符合率:
          this.onItemClickLeadtime(item.head, item.value, row.value)
          break
        case BI_TYPES.AOP完成率金额:
          this.onItemClickAOPAmount(item.head, item.value, row.value)
          break
        case BI_TYPES.预测准确率:
          this.onItemClickRate(item.head, item.value, row.value)
          break
      }
    },
    // 当月进仓机组提货率
    onItemClickType1(head, value, rowArr) {
      const params = {
        uuid: this.val.uuid
      }
      if (head === '#') {
        // 点击序号，查看某一类
        let i
        for (i = rowArr.length - 1; i >= 0; i--) {
          if (['factory', 'pbu', 'product_group', 'product_model'].includes(rowArr[i].head)) {
            break
          }
        }
        params['维度-5'] = '0'
        switch (rowArr[i].head) {
          case 'factory':
            params['维度-1'] = rowArr[i].value
            break
          case 'pbu':
            params['维度-2'] = rowArr[i].value
            break
          case 'product_group':
            params['维度-3'] = rowArr[i].value
            break
          case 'product_model':
            params['维度-4'] = rowArr[i].value
            break
        }
        this.reservePage = true
        this.$emit('emitDimensions', params)
      } else if (head === 'factory') {
        params['维度-5'] = '1'
        params['维度-1'] = value
        params['维度-2'] = '[]'
        params['维度-3'] = '[]'
        params['维度-4'] = '[]'
        this.$emit('emitDimensions', params)
      } else if (head === 'pbu') {
        params['维度-5'] = '1'
        params[`维度-2`] = value
        params['维度-3'] = '[]'
        params['维度-4'] = '[]'
        this.$emit('emitDimensions', params)
      } else if (head === 'product_group') {
        params['维度-5'] = '1'
        params[`维度-3`] = value
        params['维度-4'] = '[]'
        this.$emit('emitDimensions', params)
      } else if (head === 'product_model') {
        params['维度-5'] = '1'
        params[`维度-4`] = value
        this.$emit('emitDimensions', params)
      }
    },
    // 月平均计划达成率
    onItemClickType3(head, value, rowArr) {
      if (head === '下载') {
        this.loading = true
        const paramsJson = {}
        const fiscalYear = rowArr.find(_ => _.head === 'fiscal_year')
        const fiscalMonth = rowArr.find(_ => _.head === 'fiscal_month')
        const productionLine = rowArr.find(_ => _.head === 'production_line')
        paramsJson['type'] = this.meta.type
        paramsJson['fiscal_year'] = fiscalYear ? fiscalYear.value : ''
        paramsJson['production_line_category'] = productionLine ? productionLine.value : ''
        switch (this.meta.type) {
          case 'MTD': {
            paramsJson['fiscal_month'] = fiscalMonth ? fiscalMonth.value : ''
            break
          }
          case 'YTD': {
            const date = new Date()
            let monthStr = fiscalMonth.value.substring(0, fiscalMonth.value.length - 1)
            date.setFullYear(Number(monthStr) === 12 ? (date.getFullYear() + 1) : date.getFullYear())
            date.setMonth((Number(monthStr) + 1) % 12 - 1)
            date.setDate(1)
            date.setHours(0)
            date.setMinutes(0)
            date.setSeconds(0)
            paramsJson['plan_complete_date'] = [
              '{EXP}',
              `(,${date.getTime()})`
            ]
            break
          }
        }

        $.ajax({
          url: `/serv/script/293o${this.IS_STANDALONE ? '' : '/jsonctr'}/monthly_plan_ac_rate/download`,
          type: 'get',
          dataType: 'json',
          data: {
            paramsJson: JSON.stringify(paramsJson)
          },
          success: (data) => {
            console.log('Sample Download Data...', data.data.list.slice(0, 10))
            // 先格式化一下 list 的三个字段
            data.data.list.forEach(row => {
              row['plan_qty'] = Number(row['plan_qty'])
              row['not_qty'] = Number(row['not_qty'])
              row['plan_complete_rate'] = Number(row['plan_complete_rate'])
            })
            const result = detailDownload(data.data.list, this.detailDownloadColumns)
            exportExcel({
              'Sheet 1': result
            }, `${this.downloadFileName}.xlsx`)
            this.loading = false
          }
        })
      }
    },
    // Leadtime
    onItemClickLeadtime(head, value, rowArr) {
      if (head === 'product_group') {
        const params = {
          uuid: this.val.uuid
        }
        params['维度-1'] = value
        this.reservePage = true
        this.$emit('emitDimensions', params)
      }
    },
    // AOP 金额
    onItemClickAOPAmount(head, value, rowArr) {
      const params = {
        uuid: this.val.uuid
      }
      if (head === '#') {
        // 点击序号，查看某一类
        let i
        for (i = 0; i < rowArr.length; i++) {
          if (!['factory', 'pbu'].includes(rowArr[i].head)) {
            break
          }
        }
        params['维度-5'] = '0'
        params[`维度-${i}`] = rowArr[i - 1].value
        this.reservePage = true
        this.$emit('emitDimensions', params)
      } else if (head === 'factory') {
        params['维度-5'] = '1'
        params['维度-1'] = value
        params['维度-2'] = '[]'
        this.$emit('emitDimensions', params)
      }
    },
    onItemClickRate(head, value, rowArr) {
      const params = {
        uuid: this.val.uuid
      }
      if (head === '#') {
        // 点击序号，查看某一类
        let i
        for (i = 0; i < rowArr.length; i++) {
          if (!['factory', 'pbu', 'product_group', 'product_model'].includes(rowArr[i].head)) {
            break
          }
        }

        // 获取月份参数
        let month
        const month1 = rowArr.find(_ => _.head === 'fill_fiscal_month')
        if (month1) {
          month = month1.value
        } else {
          const month2 = rowArr.find(_ => _.head === 'forecast_fiscal_month')
          if (month2) {
            month = month2.value
          }
        }

        params['维度-5'] = '0'
        params['维度-6'] = month
        params[`维度-${i}`] = rowArr[i - 1].value
        this.reservePage = true
        this.$emit('emitDimensions', params)
      } else if (head === 'factory') {
        params['维度-5'] = '1'
        params['维度-1'] = value
        params['维度-2'] = '[]'
        params['维度-3'] = '[]'
        params['维度-4'] = '[]'
        params['维度-6'] = '[]'
        this.$emit('emitDimensions', params)
      } else if (head === 'pbu') {
        params['维度-5'] = '1'
        params[`维度-2`] = value
        params['维度-3'] = '[]'
        params['维度-4'] = '[]'
        params['维度-6'] = '[]'
        this.$emit('emitDimensions', params)
      } else if (head === 'product_group') {
        params['维度-5'] = '1'
        params[`维度-3`] = value
        params['维度-4'] = '[]'
        params['维度-6'] = '[]'
        this.$emit('emitDimensions', params)
      } else if (head === 'product_model') {
        params['维度-5'] = '1'
        params[`维度-4`] = value
        params['维度-6'] = '[]'
        this.$emit('emitDimensions', params)
      }
    },
    onItemClickInHand(head, value, rowArr) {
      const params = {
        uuid: this.val.uuid
      }
      if (head === '#') {
        // 点击序号，查看某一类
        let i
        for (i = rowArr.length - 1; i >= 0; i--) {
          if (['factory', 'pbu', 'product_group', 'product_model'].includes(rowArr[i].head)) {
            break
          }
        }
        params['维度-5'] = '0'
        switch (rowArr[i].head) {
          case 'factory':
            params['维度-1'] = rowArr[i].value
            break
          case 'pbu':
            params['维度-2'] = rowArr[i].value
            break
          case 'product_group':
            params['维度-3'] = rowArr[i].value
            break
          case 'product_model':
            params['维度-4'] = rowArr[i].value
            break
        }
        this.reservePage = true
        this.$emit('emitDimensions', params)
      } else if (head === 'factory') {
        params['维度-5'] = '1'
        params['维度-1'] = value
        params['维度-2'] = '[]'
        params['维度-3'] = '[]'
        params['维度-4'] = '[]'
        this.$emit('emitDimensions', params)
      } else if (head === 'pbu') {
        params['维度-5'] = '1'
        params[`维度-2`] = value
        params['维度-3'] = '[]'
        params['维度-4'] = '[]'
        this.$emit('emitDimensions', params)
      } else if (head === 'product_group') {
        const dimensions = this.$parent.$parent.savedChartFilters[this.val.uuid]
        if (dimensions.select_unit !== '产能') {
          params['维度-5'] = '1'
          params[`维度-3`] = value
          params['维度-4'] = '[]'
          this.$emit('emitDimensions', params)
        }
      } else if (head === 'product_model') {
        params['维度-5'] = '1'
        params[`维度-4`] = value
        this.$emit('emitDimensions', params)
      }
    }
  }
}
