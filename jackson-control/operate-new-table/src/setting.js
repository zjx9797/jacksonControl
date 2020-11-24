const setting = {
  title: '组件标题',
  config: [{
    name: '数据接口',
    key: 'apiSetting',
    items: [{
      label: '是否我的',
      type: 'panel-switch',
      value: false
    }, {
      key: 'apiPrefix',
      label: '域名',
      type: 'panel-input',
      value: 'http://10.111.83.243:8085'
    }]
  }, {
    name: '调试配置(开发用)',
    key: 'debugSetting',
    items: [{
      label: '测试环境调试',
      type: 'panel-switch',
      value: false
    }]
  }]
}

export default setting
