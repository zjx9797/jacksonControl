const mockData = {
  headerRows: 1,
  headerCols: 1,
  data: [
    ['品牌', '声量', 'TGI'],
    ['男', 10, 12],
    ['女', 9, 15],
  ]
}
function formatNumber(val) {
  return Number(val).toLocaleString('en-US');
}

const setting = {
  title: '环形图-TGI',
  version: 2,
  data: mockData,
  width: 426,
  height: 400,
  container: 1,
  themeBindings: {
    'chart-font.chart-label.color': 'chart-font.chart-label.color',
    'chart-font.chart-label.fontSize': 'chart-font.chart-label.fontSize',
    'chart-font.chart-label-value.fontSize': 'chart-font.chart-label-value.fontSize',
  },
  config: [
    {
      name: '字体设置',
      type: 'chartFont',
      key: 'chart-font',
      items: [
        {
          key: "chart-label",
          label: "标签",
          modified: true,
          type: "panel-chart-font",
          items: [
            {
              css: "color",
              key: "color",
              type: "panel-colorpicker",
              value: "#000000",
            }, {
              key: "fontSize",
              css: "font-size",
              min: 12,
              type: "panel-input-number",
              unit: "px",
              value: 14,
            }
          ]
        },
        {
          key: "chart-label-value",
          label: "值",
          modified: true,
          type: "panel-chart-font",
          items: [
            {
              key: "fontSize",
              css: "font-size",
              min: 12,
              type: "panel-input-number",
              unit: "px",
              value: 24,
            }
          ]
        }
      ]
    },
    {
      name: '色盘设置',
      key: 'color-list',
      items: [
        {
          type: "panel-multicolorpicker",
          key: 'self-color-list',
          value: ['#5598e4', '#e65278'],
          colors: []
        },
      ]
    },
    {
      name: '图表设置',
      key: 'chart-setting',
      items: [
        {
          label: '显示男女ICON',
          type: 'panel-switch',
          key: 'show-icon',
          value: true,
        },

        {
          label: '展示数值',
          type: 'panel-switch',
          key: 'label-count-show',
          value: false,
        },
        {
          label: '展示名称',
          type: 'panel-switch',
          key: 'label-name-show',
          value: false,
        },
        {
          label: '显示图例',
          type: 'panel-switch',
          key: 'legend-show',
          value: true,
        },
        {
          label: '起始角度',
          type: 'panel-slider',
          key: 'startAngle',
          value: 180,
          min: 0,
          max: 360,
          category: '圆环',
        },
        {
          label: '外圈-外半径(%)',
          type: 'panel-slider',
          key: 'radius-outter',
          value: 65,
          min: 0,
          max: 100,
          category: '圆环',
        },
        {
          label: '外圈-内半径(%)',
          type: 'panel-slider',
          key: 'radius-outter',
          value: 50,
          min: 0,
          max: 100,
          category: '圆环',
        },

        {
          label: '内圈-外半径(%)',
          type: 'panel-slider',
          key: 'radius-inner',
          value: 45,
          min: 0,
          max: 100,
          category: '圆环',
        },
        {
          label: '内圈-内半径(%)',
          type: 'panel-slider',
          key: 'radius-inner',
          value: 40,
          min: 0,
          max: 100,
          category: '圆环',
        },
        {
          label: '是否显示',
          type: 'panel-switch',
          key: 'tootip-show',
          value: true,
          category: 'Tootip设置',
        },
        {
          label: '显示百分比',
          type: 'panel-switch',
          key: 'tootip-show_percentage',
          value: false,
          category: 'Tootip设置',
        },
      ]
    }
  ]
}

const defaultOpt = {
  color: [],
  tooltip: {
    trigger: "item",
    textStyle: {
      fontSize: 12,
    },
  },
  legend: {
    // data: [],
    show: true,
    icon: 'circle',
    bottom: 18,
    left: 'center',
    itemWidth: 8,
    // textStyle:{
    //   color:'#b2e8fe',
    // }
  },
  series: [
    {
      name: "实际",
      type: "pie",
      radius: ["48%", "60%"],
      center: ['50%', '44%'],
      // hoverOffset: 8,
      selectedOffset: 0,
      selectedMode: 'single',
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: "center",
        }
      },
      emphasis: {
        itemStyle: {
        }
      },
      labelLine: {
        normal: {
          show: true,
          length: 8,
          length2: 15,
        }
      },
      // shadowColor: "rgba(142, 152, 241, 0.6)",
      data: []
    },
  ]
}

const skeletonOption = {
  animation: false,
  color: ['rgba(153, 153, 153, .3)', 'rgba(153, 153, 153, .2)', 'rgba(153, 153, 153, .1)'],
  grid: {
    left: 30,
    right: 30,
    top: 35,
    bottom: 55,
    containLabel: true
  },
  series: [
    {
      name: '',
      type: 'pie',
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      itemStyle: {
        borderColor: 'transparent',
      },
      data: [{ value: 30, name: '' }, { value: 30, name: '' }, { value: 30, name: '' }]
    }
  ]
}

export { setting, defaultOpt, formatNumber, skeletonOption, setting as default }