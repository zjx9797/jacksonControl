// 轴标和 tooltip 显示千分位
return options = {
  yAxis: [{
    axisLabel: {
      formatter: '{value}'
    }
  }],
  tooltip: {
    formatter: function(params) {
      let result = params[0].name
      params.forEach(function(item, index) {
        result += ('<br/>' + item.marker + item.seriesName + ' ' +
          (item.data[index + 1]
            ? `${item.data[index + 1]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : item.data[index + 1])
        )
      })
      return result
    }
  }
}

// coil自制率，堆积柱线图
return options = {
  series: [{}, {
    type: 'bar',
    stack: '1'
  }, {
    type: 'bar',
    stack: '1'
  }]
}

script = {
  methods: {
    hideDropdown() {
      const typeWidget = this.$store.state.widgets.find(_ => _.title === 'Type')
      if (typeWidget) {
        const type = typeWidget.config.find(_ => _.key === 'filter-conf').items.find(_ => _.key === 'paramVal').value
        const uuid = this.$store.state.widgets.find(_ => _.title === 'Month').uuid
        const monthDiv = document.querySelector(`[uuid="${uuid}"]`)
        if (type === 'MTD') {
          if (monthDiv) {
            monthDiv.style.display = 'block'
          }
        } else if (type === 'YTD') {
          if (monthDiv) {
            monthDiv.style.display = 'none'
          }
        }
      }
    }
  }
}