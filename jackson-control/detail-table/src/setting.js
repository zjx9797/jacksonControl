const customDimensions = [
  '维度-1',
  '维度-2',
  '维度-3',
  '维度-4',
  '维度-5',
  '维度-6',
  '维度-7',
  '维度-8',
  '维度-9',
  '维度-10'
]

const data = {
  headerRows: 1,
  headerCols: 1,
  data: [
    ['PBU',	'报警类型', 'MO', '物料号/设备', '状态', '处理人', '供方'],
    ['AHU-D', '缺料1', '5013464930', '4',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-C', '缺料2', '5013464934', '6',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-A', '缺料3', '5013464921', '7777',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-C', '缺料4', '5013464934', '12344',	'生产', '黄厚花', '广州市润记空调设备有限公司'],
    ['AHU-B', '缺料5', '5013464943', '667676',	'生产', '黄厚花', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料6', '5013464934', '938726',	'排休', '郭一建', 'WOLONG ELECTRIC GROUP CO.， LTD.'],
    ['CKD', '缺料7', '5013464923', '0430954',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料8', '5013464954', '34',	'生产', '高梓健', '广东吉盛机电设备有限公司'],
    ['AHU-C', '缺料9', '5013464976', '6',	'生产', '蔡新超', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料10', '5013464912', '79089',	'生产', '江晓欣', '广东振业自动化工程有限公司'],
    ['AHU-B', '缺料11', '5013464956', '348273',	'生产', '武警的', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料6', '5013464934', '938726',	'排休', '郭一建', 'WOLONG ELECTRIC GROUP CO.， LTD.'],
    ['CKD', '缺料7', '5013464923', '0430954',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料8', '5013464954', '34',	'生产', '高梓健', '广东吉盛机电设备有限公司'],
    ['AHU-C', '缺料9', '5013464976', '6',	'生产', '蔡新超', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料10', '5013464912', '79089',	'生产', '江晓欣', '广东振业自动化工程有限公司'],
    ['AHU-B', '缺料11', '5013464956', '348273',	'生产', '武警的', '佛冈县粤华空调设备有限公司']
  ]
}

const tableSetting = {
  name: '表格设置',
  items: [{
    label: '是否显示序号',
    type: 'panel-switch',
    key: 'showIndex',
    value: true
  }, {
    key: 'tableHeadHeight',
    label: '表头行高',
    type: 'panel-input-number',
    value: 26,
    min: 12,
    controls: true
  }, {
    key: 'tableContentHeight',
    label: '内容行高',
    type: 'panel-input-number',
    value: 30,
    min: 12,
    controls: true
  }, {
    key: 'tableContentStyle',
    label: '列样式表',
    type: 'panel-input',
    value: '',
    textarea: true
  }]
}

const detailPageSetting = {
  key: 'detailPageSetting',
  name: '细分业务组件',
  items: [{
    label: '当月进仓机组提货率',
    bi: true,
    key: 'Type1',
    type: 'panel-switch',
    value: false
  }, {
    label: '进仓与出仓对比',
    bi: true,
    key: 'Type2',
    type: 'panel-switch',
    value: false
  }, {
    label: '月平均计划达成率',
    bi: true,
    key: 'Type3',
    type: 'panel-switch',
    value: false
  }, {
    label: '下载表头Alias',
    key: 'Type3_DownloadHeadAlias',
    type: 'panel-input',
    textarea: true,
    value: `[
      { "column": "fiscal_year", "name": "Fiscal year" },
      { "column": "fiscal_month", "name": "Month" },
      { "column": "production_line", "name": "生产线" },
      { "column": "mo", "name": "MO" },
      { "column": "material", "name": "物料号" },
      { "column": "plan_qty", "name": "计划数量" },
      { "column": "not_qty", "name": "未完工数量" },
      { "column": "plan_complete_date", "name": "计划完成时间" }
    ]`,
    hideNSeek: {
      key: 'Type3',
      value: true
    }
  }, {
    label: '生产订单未完工',
    bi: true,
    key: 'Type4',
    type: 'panel-switch',
    value: false
  }, {
    label: '销售趋势',
    bi: true,
    key: 'Type5',
    type: 'panel-switch',
    value: false
  }, {
    label: '预测准确率',
    bi: true,
    key: 'Type6',
    type: 'panel-switch',
    value: false
  }, {
    label: 'AOP完成率数量',
    bi: true,
    key: 'Type7',
    type: 'panel-switch',
    value: false
  }, {
    label: 'AOP完成率金额',
    bi: true,
    key: 'Type8',
    type: 'panel-switch',
    value: false
  }, {
    label: '在手订单新增趋势',
    bi: true,
    key: 'Type9',
    type: 'panel-switch',
    value: false
  }, {
    label: '成品生产产出',
    bi: true,
    key: 'Type10',
    type: 'panel-switch',
    value: false
  }, {
    label: 'leadtime符合率',
    bi: true,
    key: 'Type11',
    type: 'panel-switch',
    value: false
  }, {
    label: '平均在库天数分析',
    bi: true,
    key: 'Type12',
    type: 'panel-switch',
    value: false
  }, {
    label: 'COIL自制率',
    bi: true,
    key: 'Type13',
    type: 'panel-switch',
    value: false
  }, {
    label: '库存账龄分析',
    bi: true,
    key: 'Type14',
    type: 'panel-switch',
    value: false
  }]
}

const dimensionsSetting = {
  key: 'dimensions',
  custom: true,
  customDimensions
}

const otherSetting = {
  key: 'otherSetting',
  name: '其他设置',
  items: [{
    key: 'downloadFileName',
    label: '下载文件名',
    type: 'panel-input',
    value: ''
  }]
}

const setting = {
  title: '细分看板表格',
  version: 2,
  width: 800,
  height: 400,
  config: [
    dimensionsSetting,
    tableSetting,
    detailPageSetting,
    otherSetting
  ],
  data
}

export default setting
