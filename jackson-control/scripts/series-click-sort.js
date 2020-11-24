script = {
  methods: {
    onLoaded() {
      const tooltipFormatter = function(params) {
        let result = params[0].name
        params.forEach(function(item) {
          result += ('<br/>' + item.marker + item.seriesName + ' ' +
            (item.data[item.seriesIndex + 1]
              ? `${item.data[item.seriesIndex + 1]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : item.data[item.seriesIndex + 1])
          )
        })
        return result
      }

      const vm = this.$children[1].$children[0].$children[0].$children[0]
      const instance = vm.instance
      console.log(vm.options)
      window.salesAreaSource = vm.options.dataset.source

      instance.on('legendselectchanged', function(params) {
        if (params.selected['data1'] && params.selected['data2']) {
          vm.options.dataset.source = window.salesAreaSource
          vm.options.legend.selected = params.selected
          vm.options.tooltip.formatter = tooltipFormatter
          instance.setOption(vm.options, true)
        } else if (params.selected['data1']) {
          const newData = window.salesAreaSource.slice(1)
          newData.sort((a, b) => b[1] - a[1])
          vm.options.dataset.source = [window.salesAreaSource[0]].concat(newData)
          vm.options.legend.selected = params.selected
          vm.options.tooltip.formatter = tooltipFormatter
          instance.setOption(vm.options, true)
        } else if (params.selected['data2']) {
          const newData = window.salesAreaSource.slice(1)
          newData.sort((a, b) => b[2] - a[2])
          vm.options.dataset.source = [window.salesAreaSource[0]].concat(newData)
          vm.options.legend.selected = params.selected
          vm.options.tooltip.formatter = tooltipFormatter
          instance.setOption(vm.options, true)
        }
      })
    }
  }
}