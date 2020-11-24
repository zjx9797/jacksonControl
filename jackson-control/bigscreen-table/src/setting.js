const defaultData = {
  headerCols: 1,
  headerRows: 1,
  data: [
    ['事件类型','事件描述', '发起时间', '跟进部门', '跟进人', '跟进状态', 'parentId'],
    ['AHU-D', '缺料1', 1576315652000, '未填写',	'未填写', '未完成', 1],
    ['AHU-C', '缺料2', 1576315652000, '未填写',	'未填写', '未完成', 1],
    ['AHU-A', '缺料3', 1576747652000, '未填写',	'未填写', '未完成', 1],
    ['AHU-C', '缺料4', null, '未填写',	'未填写', '未完成', 2],
    ['AHU-B', '缺料5', null, '未填写',	'未填写', '未完成', 2],
    ['AHU-D', '缺料6', null, '未填写',	'未填写', '未完成', 8],
    ['CKD', '缺料7', null, '未填写',	'未填写', '未完成', 8],
    ['AHU-D', '缺料8', null, '未填写',	'未填写', '未完成', 11],
    ['AHU-C', '缺料9', null, '未填写',	'未填写', '未完成', 12],
    ['AHU-D', '缺料10', null, '未填写',	'未填写', '未完成', 60],
    ['AHU-B', '缺料11', null, '未填写',	'未填写', '未完成', 60]
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

const dataSetting = {
  name: '数据设置',
  items: [{
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

const specialComponent = {
  name: '特例组件',
  items: [{
    key: 'isEventTabel',
    type: 'panel-switch',
    label: '驱动事件未完成列表',
    value: false
  }, {
    key: 'eventParentId',
    label: '父级事件Id表头名',
    type: 'panel-input',
    value: '父事件ID',
    hideNSeek: { key: 'isEventTabel', value: true }
  }, {
    key: 'eventCloneName',
    label: '计划关闭时间表头名',
    type: 'panel-input',
    value: '计划关闭时间',
    hideNSeek: { key: 'isEventTabel', value: true }
  }, {
    key: 'eventStatusName',
    label: '跟进状态表头名',
    type: 'panel-input',
    value: '跟进状态',
    hideNSeek: { key: 'isEventTabel', value: true }
  }]
}

const refreshSetting = {
  name: '组件配置',
  items: [{
    key: 'showStripe',
    type: 'panel-switch',
    label: '是否显示斑马纹',
    value: true
  }, {
    key: 'isScrollTable',
    type: 'panel-switch',
    label: '表格是否需要滚动',
    value: true
  }, {
    key: 'isScrollEnter',
    type: 'panel-switch',
    label: '悬浮停止滚动',
    value: false
  }, {
    key: 'tableScrollTimeSet',
    label: '表格滚动速度(ms)',
    type: 'panel-input-number',
    value: 20,
    min: 1,
    controls: true
  }, {
    key: 'tableScrollTimeStop',
    label: '表格滚动之后停止的时间(s)',
    type: 'panel-input-number',
    value: 1,
    min: 0,
    controls: true
  }]
}

const setting = {
  title: '表格组件',
  version: 2,
  data: defaultData,
  config: [dataSetting, tableHeader, tableContent, refreshSetting, specialComponent]
}

export default setting
