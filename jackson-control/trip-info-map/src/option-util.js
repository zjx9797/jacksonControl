const routeColors = [
  '#00FFFA',
  '#fbb400',
  '#8dc53e',
  '#de44ff',
  '#ff3678',
  '#4456ff',
  '#9638ff',
  '#fb5900',
  '#3cd463',
  '#ff4646'
]

const generateOption = (displayData) => {
  const series = []
  series.push({
    type: 'map',
    map: 'china',
    label: {
      show: false
    },
    itemStyle: {
      normal: {
        label: {
          show: false
        },
        borderColor: '#1D75B0',
        borderWidth: 1,
        areaColor: '#042A83'
      },
      emphasis: {
        label: {
          show: false
        },
        borderColor: '#1D75B0',
        borderWidth: 1,
        areaColor: '#042A83'
      }
    },
    z: 1
  })

  const linesData = []
  const scatterData = []
  displayData.forEach(({ points }, index) => {
    const color = routeColors[index % routeColors.length]

    linesData.push({
      coords: points.map(_ => _.pos),
      lineStyle: { color }
    })
    points.forEach(({ pos }) => {
      scatterData.push({
        value: pos,
        itemStyle: { normal: { color } }
      })
    })
  })

  series.push({
    type: 'lines',
    // polyline: true,
    lineStyle: {
      width: 1,
      opacity: 1,
      curveness: 0.3
    },
    data: linesData,
    effect: {
      show: true,
      constantSpeed: 60,
      symbol: 'pin',
      symbolSize: 6,
      trailLength: 0
    },
    z: 2
  })

  series.push({
    type: 'scatter',
    coordinateSystem: 'geo',
    zlevel: 2,
    symbolSize: 5,
    label: {
      normal: {
        show: false
      }
    },
    itemStyle: {
      normal: {
        shadowBlur: 3,
        shadowColor: routeColors[0]
      }
    },
    data: scatterData
  })

  series.push({
    type: 'effectScatter',
    coordinateSystem: 'geo',
    zlevel: 2,
    rippleEffect: {
      brushType: 'stroke',
      scale: 5
    },
    symbolSize: 12,
    label: {
      normal: {
        show: true,
        position: 'right',
        color: '#d7f7ff',
        fontSize: 10,
        formatter: '{b}'
      }
    },
    itemStyle: {
      normal: {
        shadowBlur: 3,
        shadowColor: routeColors[0]
      }
    },
    data: []
  })

  return {
    geo: {
      type: 'map',
      map: 'china',
      itemStyle: {
        normal: {
          borderColor: '#167cba',
          borderWidth: 1,
          areaColor: '#002786'
        }
      }
    },
    series
  }
}

export default generateOption
