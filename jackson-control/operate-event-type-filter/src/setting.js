const setting = {
  title: '自定义组件',
  config: [{
    key: 'style',
    name: '样式设置',
    items: [{
      label: '是否开启圆角',
      type: 'panel-switch',
      key: 'borderRadiusSwitch',
      value: true,
      disabled: false
    }]
  }, {
    name: '数据接口',
    key: 'apiSetting',
    items: [{
      key: 'apiPrefix',
      label: '域名',
      type: 'panel-input',
      value: 'http://10.111.83.243:8085'
    }]
  }, {
    name: '调试模式(开发用)',
    key: 'debugSetting',
    items: [{
      label: '测试环境',
      type: 'panel-switch',
      value: false
    }]
  }]
}

export default setting
