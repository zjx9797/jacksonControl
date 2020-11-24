const targetTitle = '柱状图'
const realDimensionNames = ['字段名称']

script = {
  methods: {
    click2EmitCustomParamsUpdate() {
      const widgets = this.$store.state.widgets
      const target = widgets.find(_ => _.title === targetTitle)
      if (target) {
        const params = {}
        params[target.uuid] = {}
        realDimensionNames.forEach(name => {
          params[target.uuid][name] = []
        })
        this.$emit('emitCustomParamsUpdate', params)
      }
    }
  }
}