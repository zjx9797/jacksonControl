const mockData = {
  headerRows: 1,
  headerCols: 1,
  data: [
    ['地区',	'普通数', 'TGI'],
    ['北京',	2922,	2611],
    ['上海',	2309,	2423],
    ['广东',	2031,	2112],
    ['福建',	1919,	1911],
    ['湖北',	1900,	1511],
    ['浙江',	2597,	2533],
    ['四川',	1301,	1311],
    ['重庆',	2700,	2734],
    ['新疆',	1000,	1000],
    ['青海',	1050,	1000],
    ['西藏',	1200,	1200],
    ['内蒙古', 1000, 1000],
    ['宁夏',	1800,	1800],
    ['甘肃',	1200,	1200],
    ['陕西',	1400,	1400],
    ['贵州',	2000,	2000],
    ['广西',	1700,	1700],
    ['云南',	1500,	1500],
    ['湖南',	2200,	2200],
    ['江西',	2200,	2200],
    ['河南',	2300,	2300],
    ['山西',	1900,	1900],
    ['天津',	1600,	1600],
    ['山东',	1600,	1600],
    ['江苏',	2600,	2600],
    ['安徽',	2100,	2100],
    ['海南',	1600,	1600],
    ['台湾',	2500,	2600],
    ['辽宁',	1500,	1600],
    ['吉林',	1100,	1100],
    ['黑龙江', 1500, 1600],
  ]
}

const setting = {
  title: '柱状图-TGI',
  version: 2,
  data: mockData,
  width: 640,
  height: 400,
  container: 1,
  containerOptions: {
    // exclude: ['table-details', 'sheet-conf', 'data-format-conf'],
    exclude: ['sheet-conf', 'data-format-conf'],
  },
  config: [
    {
      name: '色盘设置',
      key: 'color-list',
      items: [
        {
          type: "panel-multicolorpicker",
          key: 'self-color-list',
          value: [],
          colors: []
        },
      ]
    },
    {
      name: '图表设置',
      key: 'chart-setting',
      items: [
        {
          label: '显示图例',
          type: 'panel-switch',
          key: 'legend-show',
          value: true,
        },
        {
          label: 'Tootip是否显示',
          type: 'panel-switch',
          key: 'tootip-show',
          value: true,
        },
        {
          label: '展示数值',
          type: 'panel-switch',
          key: 'provice-show-value',
          value: false,
        },
        {
          label: '地图区域颜色',
          type: "panel-colorpicker",
          key: 'map-border-color',
          value: '#D7D7D7',
          category: '地图区域颜色',
        },
      ]
    }
  ]
}

const defaultOpt = {
  animation: false,
  color: ["rgba(153, 153, 153, .15)"],
  geo: {
    map: 'china',
    roam: false,
    itemStyle: {
      normal: {
        areaColor: 'rgba(153, 153, 153, .15)',
        borderColor: 'rgba(153, 153, 153, .15)',
        borderWidth: 1
      },
      emphasis: {
        areaColor: 'rgba(153, 153, 153, .15)'
      }
    }
  },
  tooltip: {
    trigger: "item",
    show: true,
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      fontSize: 12,
    },
  },
  legend: {
    data:[],
    show: true
  },
  visualMap:[{
      inRange: {
          color: ['#AC3931', "#F18F01", "#29B9B5"]
      },
      min: 0,
      max: 0,
      text:['高','低'],
      realtime: false,
      calculable: true,
      show: true,
      itemWidth: 15,
      itemHeight: 100,
  }],
  series: [{
      animation: true,
      itemStyle: {
        normal: {
          borderColor: "#d7d7d7",
          // borderWidth: 1,
          // shadowBlur: 30,
          // shadowColor: "#d7d7d7",
          // areaColor: 'rgba(153, 153, 153, .15)',
          // borderColor: 'rgba(153, 153, 153, .15)',
          // borderWidth: 1
        },
        emphasis: {
          areaColor: {
            colorStops: [
              { offset: 0, color: 'rgba(0, 189, 190, .3)' },
              { offset: 0, color: 'rgba(0, 189, 190, .5)' },
            ],
            r: 0.8,
            type: "radial",
            x: 0.5,
            y: 0.5,
          },

          // areaColor: "rgba(0,188,190,0.5)",
          // borderColor: "#00bcbe",
          // color: "#00bcbe",
        }
      },
      type: 'map',
      mapType:'china',
      roam: false,
      trigger: 'item',

      label: {
        normal: {
          show: false,
        },
        emphasis: {
          show: true,
          textShadowColor: '#fff',
          textShadowBlur: 2,
          color: "#00bcbe",
          fontSize: 14,
          fontWeight: "bold",
        },
      },
      data : []
  }]
}

const skeletonOption = {
  animation: false,
  color: ["rgba(153, 153, 153, .15)"],
  geo: {
    map: 'china',
    roam: false,
    itemStyle: {
      normal: {
        areaColor: 'rgba(153, 153, 153, .15)',
        borderColor: 'rgba(153, 153, 153, .15)',
        borderWidth: 1
      },
      emphasis: {
        areaColor: 'rgba(153, 153, 153, .15)'
      }
    }
  },
  legend: {
    data:[],
    show: true
  },
  visualMap:[{
      inRange: {
          color: ["rgba(153, 153, 153, .25)", "rgba(153, 153, 153, .15)"]
      },
      text:['High','Low'],
      realtime: false,
      calculable: true,
      show:false,
  }],
  series: [{
      animation: true,
      itemStyle: {
        normal: {
          areaColor: 'rgba(153, 153, 153, .15)',
          borderColor: 'rgba(153, 153, 153, .15)',
          borderWidth: 1
        },
        emphasis: {
          areaColor: 'rgba(153, 153, 153, .15)'
        }
      },
      type: 'map',
      mapType:'china',
      roam: false,
      trigger: 'item',
      label: {
          show: false
      },
      data : []
  }]
};

export { setting, defaultOpt, skeletonOption, setting as default }