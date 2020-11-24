import { BI_TYPES } from './biType'

export default {
  computed: {
    // 序号是否可点
    isIndexClickable() {
      switch (this.biType) {
        case BI_TYPES.当月进仓机组提货率:
        case BI_TYPES.进仓与出仓对比:
        case BI_TYPES.销售趋势:
        case BI_TYPES.预测准确率:
        case BI_TYPES.AOP完成率数量:
        case BI_TYPES.AOP完成率金额:
        case BI_TYPES.在手订单新增趋势:
        case BI_TYPES.成品生产产出:
          return true
        default:
          return false
      }
    },
    // 是否显示下载按钮
    showDownloadBtn() {
      switch (this.biType) {
        case BI_TYPES.月平均计划达成率:
        case BI_TYPES.生产订单未完工:
        case BI_TYPES.预测准确率:
        case BI_TYPES.当月进仓机组提货率:
        case BI_TYPES.进仓与出仓对比:
        case BI_TYPES.销售趋势:
        case BI_TYPES.成品生产产出:
        case BI_TYPES.平均在库天数分析:
        case BI_TYPES.库存账龄分析:
        case BI_TYPES.在手订单新增趋势:
          return false
        default:
          return true
      }
    },
    // 月平均计划达成率明细下载配置项
    detailDownloadColumns() {
      const columnsJSONStr = this.$panel.detailPageSetting.items.find(_ => _.key === 'Type3_DownloadHeadAlias').value
      try {
        return JSON.parse(columnsJSONStr)
      } catch (e) {
        return []
      }
    },
    // 业务类型
    biType() {
      const biTypeObj = this.val.config.find(_ => _.key === 'detailPageSetting')
        .items.filter(_ => _.bi).find(_ => _.value)
      return biTypeObj ? biTypeObj.key : BI_TYPES.当月进仓机组提货率
    },
    // Leadtime 十分特殊，需要特殊关照
    isLeadtime() {
      return this.biType === BI_TYPES.leadtime符合率
    }
  },
  watch: {
    biType: {
      immediate: true,
      handler() {
        const type = Object.entries(BI_TYPES).find(_ => _[1] === this.biType)
        if (type && this.$route.name === 'LegoEditFramework') {
          this.val.config.find(_ => _.key === 'otherSetting')
            .items.find(_ => _.key === 'downloadFileName').value = type[0]
        }
      }
    }
  }
}