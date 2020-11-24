export function getPercentage(row) {
  // 兼容处理两种数据方案
  // 1. 有两列，则是第一列除以第二列
  // 2. 有一列，直接以一列为显示数据
  let result
  if (row[2] === undefined || row[2] === null || row[2] === '') {
    result = Number(row[1]).toFixed(2)
  } else {
    result = row[2] ? Number(row[1] / row[2] * 100).toFixed(2) : '0.00'
  }
  return result > 100 ? '100.00' : result
}

/**
 * 获取 echarts 的 option 选项
 * @param dataArray 数据集
 * @param colors 色盘
 * @param bgColor 圆环背景色
 * @param showLegend 是否显示图例
 *
 * @return echarts options
 */
export function getOptionFromData(dataArray, colors, bgColor, showLegend, lineWidth) {
  const styleArray = []
  for (let i = 0; i < 7; i++) {
    styleArray.push({
      radius: [`${100 - lineWidth * (2 * i + 1)}%`, `${100 - lineWidth * i * 2}%`],
      color: colors[i] || '#01B1EF'
    })
  }

  let template = {
    name: null,
    type: 'pie',
    hoverAnimation: false,
    radius: null,
    itemStyle: {
      normal: {
        label: {
          show: false
        }
      }
    },
    data: [
      {
        value: null,
        itemStyle: {
          normal: {
            color: null
          }
        }
      },
      {
        value: null,
        itemStyle: {
          normal: {
            color: null
          }
        }
      }
    ]
  }

  const series = dataArray.map((item, index) => {
    const templateObj = JSON.parse(JSON.stringify(template))

    templateObj.radius = styleArray[index].radius

    templateObj.data[0].value = getPercentage(item)
    templateObj.data[0].name = item[0]
    templateObj.data[1].value = 100 - templateObj.data[0].value

    templateObj.data[0].itemStyle.normal.color = styleArray[index].color
    templateObj.data[1].itemStyle.normal.color = bgColor

    return templateObj
  })

  return {
    legend: {
      show: showLegend,
      orient: 'vertical',
      y: 'center',
      right: 40,
      align: 'left',
      icon: 'circle',
      itemGap: 0,
      itemWidth: 8,
      itemHeight: 8,
      data: dataArray.map(item => item[0]),
      formatter(name) {
        return `${name}: ${getPercentage(dataArray.find(_ => _[0] === name))}%`
      },
      textStyle: {
        color: '#4082C2',
        fontSize: 10
      }
    },
    tooltip: {
      show: true,
      formatter: param => {
        const valueIndex = param.componentIndex
        const data = dataArray[valueIndex]
        const showPointColor = styleArray[valueIndex].color
        const actual = `${data[1]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        const goal = `${data[2]}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return `${param.marker} ${actual}/${goal}`
      }
    },
    series
  }
}

export function throttle(fn, delay) {
  let timer = null
  return function () {
    var context = this, args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}