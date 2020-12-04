const customDimensions = ['报警类型','告警级别']
const dimensions = {
  key: 'dimensions', 
  custom: true,
  customDimensions
}
const setting = {
  title: '内容文本',
  height: 35,
  width: 420,
  version: 2,
  data: {
    headerRows: 1,
    headerCols: 1,
    data: [
      ['', '文字内容'],
      ['物料', '31'],
      ['设备', '10'],
      ['质量', '0'],
    ]
  },
  config: [{
    name: "配置",
    items: [{
      label: '字体大小',
      css: 'fontSize',
      type: 'panel-slider',
      key: 'labelFontSize',
      value: 14,
      min: 12,
      max: 100,
      unit: 'px'
    },
    {
      label: '字体大小',
      css: 'fontSize',
      type: 'panel-slider',
      key: 'numFontSize',
      value: 16,
      min: 12,
      max: 100,
      unit: 'px'
    },
    {
      key: 'titleContent',
      label: '标题',
      type: 'panel-input',
      value: '产线报警超时分布'
    },
    {
      key: "labelColor",
      label: "标签字体颜色",
      css: "borderColor",
      type: "panel-colorpicker",
      value: "#00A6FB"
  },
    {
      key: "isTime",
      label: "是否为超时分布",
      type: "panel-switch",
      value: true
    },
    {
      key: "isNum",
      label: "是否为数量分布",
      type: "panel-switch",
      value: false
    },{
      key: "isRealTime",
      label: "是否为实时模块",
      type: "panel-switch",
      value: false
    }]
  },dimensions]
}

export default setting
