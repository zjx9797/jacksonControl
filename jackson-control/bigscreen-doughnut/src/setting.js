const refreshPanel = {
  name: '组件配置',
  key: 'config',
  items: [{
    key: 'auto-refetch',
    type: 'panel-switch',
    label: '自动请求更新',
    value: false
  }, {
    key: 'auto-refetch-time',
    type: 'panel-input-number',
    label: '自动请求更新时间 (s)',
    value: 60,
    min: 10,
    hideNSeek: { key: 'auto-refetch', value: true }
  }]
}

const graphPanel = {
  name: '图表设置',
  key: 'graph-panel',
  items: [{
    key: 'colors',
    label: '色盘（从外到内）',
    type: 'panel-multicolorpicker',
    value: ['#01B1EF', '#8DC63F', '#FFB400', '#047CFF', '#00E6DB', '#E16BBC', '#7952B3']
  }, {
    key: 'bgColor',
    label: '圆环背景色',
    type: 'panel-colorpicker',
    value: '#012474'
  }, {
    key: 'lineWidth',
    label: '线宽(%)',
    type: 'panel-slider',
    value: 7
  }, {
    key: 'showInsideNumber',
    label: '在中间显示数值',
    type: 'panel-switch',
    value: false
  }, {
    hideNSeek: { key: 'showInsideNumber', value: true },
    label: '中间字体',
    key: 'insideFont',
    type: 'panel-chart-font',
    items: [{
      type: 'panel-colorpicker',
      value: '#01B1EF',
      key: 'color'
    }, {
      type: 'panel-input-number',
      key: 'fontSize',
      value: 36,
      min: 12,
      unit: 'px'
    }, {
      type: 'panel-radio-group',
      key: 'fontWeight',
      value: 'normal',
      options: [{
        value: 'normal',
        name: '常规'
      }, {
        value: 'bold',
        name: '加粗'
      }]
    }]
  }, {
    hideNSeek: { key: 'showInsideNumber', value: true },
    label: '后缀',
    key: 'insidePost',
    type: 'panel-input',
    value: '%'
  }, {
    hideNSeek: { key: 'showInsideNumber', value: true },
    label: '后缀字体',
    key: 'insidePostFont',
    type: 'panel-chart-font',
    items: [{
      type: 'panel-colorpicker',
      value: '#01B1EF',
      key: 'color'
    }, {
      type: 'panel-input-number',
      key: 'fontSize',
      value: 36,
      min: 12,
      unit: 'px'
    }, {
      type: 'panel-radio-group',
      key: 'fontWeight',
      value: 'normal',
      options: [{
        value: 'normal',
        name: '常规'
      }, {
        value: 'bold',
        name: '加粗'
      }]
    }]
  }, {
    key: 'showLegend',
    label: '显示图例',
    type: 'panel-switch',
    value: true
  }]
}

const setting = {
  version: 2,
  title: '江森圆环图',
  data: {
    headerCols: 1,
    headerRows: 1,
    data: [
      ['', '实际数量', '预测数量'],
      ['STC', 62, 100],
      ['MTC', 75, 100],
      ['AHU', 50, 100],
      ['FCU', 70, 100],
      ['ABC', 20, 100],
      ['DEF', 60, 100],
      ['GHI', 44, 100]
    ]
  },
  config: [refreshPanel, graphPanel]
}

export default setting
