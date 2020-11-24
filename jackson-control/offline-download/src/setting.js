const setting = {
  title: '离线下载',
  version: 2,
  width: 400,
  height: 50,
  config: [{
    name: '接口前缀',
    key: 'api',
    items: [{
      label: 'prefix',
      type: 'panel-input',
      value: '/jsonctrmgt'
    }]
  }, {
    name: '细分页面',
    key: 'bi',
    items: [{
      label: '当月进仓机组提货率',
      type: 'panel-switch',
      key: 'MONTH_UNIT_PICKUP_RATE',
      value: false
    }, {
      label: '进仓和出仓对比',
      type: 'panel-switch',
      key: 'ENTRY_EXIT_COMPARISON',
      value: false
    }, {
      label: '销售趋势',
      type: 'panel-switch',
      key: 'SALES_TREND',
      value: false
    }, {
      label: '成品生产产出',
      type: 'panel-switch',
      key: 'FINISHED_PRODUCT_OUTPUT',
      value: false
    }, {
      label: '平均在库天数',
      type: 'panel-switch',
      key: 'AVERAGE_DAY_IN_WAREHOUSE',
      value: false
    }, {
      label: '库存账龄分析',
      type: 'panel-switch',
      key: 'INVENTORY_AGING_ANALYSIS',
      value: false
    }, {
      label: '在手订单新增趋势',
      type: 'panel-switch',
      key: 'INCREASINIG_TREND_OF_ORDERS_IN_HAND',
      value: false
    }]
  }]
}

export default setting
