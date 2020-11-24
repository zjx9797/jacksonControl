const setting = {
  title: '事件类型管理fit配置组件',
  config: [{
    name: '数据接口',
    key: 'apiSetting',
    items: [{
      key: 'apiPrefix',
      label: '域名',
      type: 'panel-input',
      value: '/jsonctrmgt'
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
