import exportExcel from '../export-xlsx'
import { BI_TYPES } from '../bi-mixins/biType'

export default {
  methods: {
    // 普通下载
    onDownloadData() {
      switch (this.biType) {
        case BI_TYPES.AOP完成率金额:
        case BI_TYPES.AOP完成率数量:
        case BI_TYPES.COIL自制率:
        case BI_TYPES.在手订单新增趋势:
        case BI_TYPES.leadtime符合率: {
          const params = {}
          params['Sheet 1'] = this.downloadData[1]
          exportExcel(params, `${this.downloadFileName}.xlsx`)
          break
        }
        default: {
          const params = {}
          params['Sheet 1'] = [
            this.dataHead.map(_ => _.displayValue),
            ...this.mapData.body
          ]
          exportExcel(params, `${this.downloadFileName}.xlsx`)
        }
      }
    }
  }
}