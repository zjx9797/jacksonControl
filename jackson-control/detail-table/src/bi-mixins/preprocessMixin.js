import { BI_TYPES } from './biType'

export default {
  methods: {
    preprocessData() {
      switch (this.biType) {
        // 删除type添加下载
        case BI_TYPES.月平均计划达成率: {
          let type = ''
          this.mapData.head.pop()
          this.mapData.head.push('下载')
          this.mapData.body.forEach(rowData => {
            type = rowData.pop()
            rowData.push('数据下载')
          })
          this.meta = { type }

          // 每页只显示 9 条数据
          this.pageSize = 9
          break
        }
        case BI_TYPES.平均在库天数分析: {
          this.pageSize = 12
          break
        }
        case BI_TYPES.预测准确率:
          this.pageSize = 12
          break
        case BI_TYPES.在手订单新增趋势: {
          const dimensions = this.$parent.$parent.savedChartFilters[this.val.uuid]
          // 处理页码数与新增工厂一列
          if (dimensions.select_unit === '产能') {
            this.pageSize = 4
          } else {
            this.mapData.head.unshift('factory')
            this.mapData.body.forEach(rowData => {
              rowData.unshift('GZF')
            })
          }
          break
        }
      }
    }
  }
}