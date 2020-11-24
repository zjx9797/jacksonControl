const customDimensions = ['产线']
const defaultData = {
  headerCols: 1,
  headerRows: 1,
  data: [
    ['产线',	'报警类型', 'MO', '物料号/设备', '状态', '处理人', '供方'],
    ['AHU-D', '缺料1', '5013464930', '4',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-C', '缺料2', '5013464934', '6',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-A', '缺料3', '5013464921', '7777',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-C', '缺料4', '5013464934', '12344',	'生产', '黄厚花', '广州市润记空调设备有限公司'],
    ['AHU-B', '缺料5', '5013464943', '667676',	'生产', '黄厚花', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料6', '5013464934', '938726',	'排休', '郭一建', 'WOLONG ELECTRIC GROUP CO.， LTD.'],
    ['CKD', '缺料7', '5013464923', '0430954',	'生产', '高梓健', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料8', '5013464954', '34',	'生产', '高梓健', '广东吉盛机电设备有限公司'],
    ['AHU-C', '缺料9', '5013464976', '6',	'生产', '蔡新超', '佛冈县粤华空调设备有限公司'],
    ['AHU-D', '缺料10', '5013464912', '79089',	'生产', '蔡新超', '广东振业自动化工程有限公司'],
    ['AHU-B', '缺料11', '5013464956', '348273',	'生产', '武警的', '佛冈县粤华空调设备有限公司']
  ]
}

const tableHeader = {
  name: '表头设置',
  items: [{
    key: 'tableHeaderFrontColor',
    label: '文字颜色',
    type: 'panel-colorpicker',
    value: '#d7f7ff'
  }, {
    key: 'tableHeaderBackColor',
    label: '背景颜色',
    type: 'panel-colorpicker',
    value: 'transparent',
  }]
}

const dataSetting = {
  name: '数据设置',
  items: [{
    key: 'dataSettingPrimary',
    label: '预警数据',
    type: 'panel-input',
    value: '状态=排休'
  }, {
    key: 'isDefaultHeadData',
    type: 'panel-switch',
    label: '是否固定表头数据',
    value: false
  }, {
    key: 'defaultHeadData',
    label: '表头数据',
    type: 'panel-input',
    value: '',
    textarea: true,
    hideNSeek: { key: 'isDefaultHeadData', value: true }
  }]
}

const tableContent = {
  name: '表格内容样式设置',
  items: [{
    key: 'tableContentHeight',
    label: '行高',
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

const dimensions = {
  key: 'dimensions', 
  custom: true,
  customDimensions
}

const setting = {
  title: '表格组件',
  version: 2,
  data: defaultData,
  config: [tableHeader, tableContent, dataSetting, dimensions]
}

export default setting
