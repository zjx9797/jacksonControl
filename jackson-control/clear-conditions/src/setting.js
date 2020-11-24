const params = {
  'Params1': [],
  'Params2': [],
  'Params3': [],
  'Params4': [],
  'Params5': [],
  'Params6': [],
}

const setting = {
  title: '重置',
  version: 2,
  width: 50,
  height: 50,
  config: [{
    key: 'dimensions',
    custom: true,
    customDimensions: Object.keys(params)
  }, {
    name: '组件配置',
    key: 'options',
    items: [{
      key: 'size',
      label: '图标大小',
      type: 'panel-slider',
      value: 16,
      min: 10
    }]
  }]
}

export {
  setting,
  params
}
