import { BI_TYPES } from './biType'

export default {
  methods: {
    setCellClickable(obj) {
      switch (this.biType) {
        case BI_TYPES.当月进仓机组提货率:
        case BI_TYPES.进仓与出仓对比:
        case BI_TYPES.销售趋势:
        case BI_TYPES.预测准确率:
        case BI_TYPES.AOP完成率数量:
        case BI_TYPES.成品生产产出: {
          if (['factory', 'pbu', 'product_group', 'product_model'].includes(obj.head)) {
            obj.class = 'hover'
          }
          break
        }
        case BI_TYPES.在手订单新增趋势: {
          const dimensions = this.$parent.$parent.savedChartFilters[this.val.uuid]
          if (dimensions.select_unit !== '产能') {
            if (['factory', 'pbu', 'product_group', 'product_model'].includes(obj.head)) {
              obj.class = 'hover'
            }
          }
          break
        }
        case BI_TYPES.月平均计划达成率:
          if (obj.head === '下载') {
            obj.class = 'hover'
          }
          break
        case BI_TYPES.生产订单未完工:
          break
        case BI_TYPES.leadtime符合率:
          if (obj.head === 'product_group') {
            obj.class = 'hover'
          }
          break
        case BI_TYPES.AOP完成率金额:
          if (['factory', 'pbu'].includes(obj.head)) {
            obj.class = 'hover'
          }
          break
      }
    }
  }
}
