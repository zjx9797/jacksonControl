const setting = {
  title: '内容文本',
  height: 30,
  width: 85,
  version: 2,
  data: {
    headerRows: 1,
    headerCols: 1,
    data: [
      ['', '文字内容'],
      ['文字内容', '文字内容在数据集设置']
    ]
  },
  config: [{
    name: "文本设置",
    items: [{
      label: '字体大小',
      css: 'fontSize',
      type: 'panel-slider',
      value: 16,
      min: 12,
      max: 100,
      unit: 'px'
    }, {
      label: '字体加粗',
      css: 'fontWeight',
      type: 'panel-radio-group',
      value: 'normal',
      options: [{
        name: '常规',
        value: 'normal'
      }, {
        name: '加粗',
        value: 'bold'
      }]
    }]
  }, {
    name: "颜色设置",
    items: [{
      label: '字体颜色',
      css: 'color',
      type: 'panel-colorpicker',
      value: '#fff'
    }]
  }, {
    name: "排版设置",
    items: [{
      label: '行高',
      css: 'lineHeight',
      type: 'panel-slider',
      value: 1.5,
      min: 0,
      max: 10,
      step: 0.1,
      unit: 'em'
    }, {
      label: '间距',
      css: 'letterSpacing',
      type: 'panel-slider',
      value: 0,
      min: 0,
      max: 3,
      step: 0.1,
      unit: 'em'
    }, {
      label: '水平居中',
      key: 'text-align',
      type: 'panel-switch',
      value: false,
      css: 'text-align',
      cssVal: 'center'
    }, {
      label: '垂直居中',
      key: 'vertical-align',
      type: 'panel-switch',
      value: false,
      css: 'margin',
      cssVal: 'auto 0'
    }]
  }, {
    name: '组件配置',
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
  }]
}

export default setting
