import { estimateNumber } from './fn';

const mockData = {
  headerRows: 1,
  headerCols: 1,
  data: [
    ['年份', '普通', 'TGI'],
    ['2017', 42000, 37110],
    ['2018', 42011, 37220],
    ['2019', 43123, 37330],
  ]
}

const setting = {
  title: '柱状图-TGI',
  version: 2,
  data: mockData,
  width: 640,
  height: 400,
  container: 1,
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
          label: '是否显示',
          type: 'panel-switch',
          key: 'tootip-show',
          value: true,
          category: 'Tootip设置',
        },
        {
          label: '圆角',
          type: 'panel-slider',
          key: 'radius-width',
          value: 2,
          min: 0,
          max: 30,
        },
        {
          label: '宽度-1',
          type: 'panel-slider',
          key: 'bar-width',
          value: 10,
          min: 0,
          max: 50,
          category: '柱宽'
        },
        {
          label: '宽度-2',
          type: 'panel-slider',
          key: 'bar-width',
          value: 3,
          min: 0,
          max: 10,
          category: '柱宽'
        },
        {
          type: "panel-colorpicker",
          key: 'split-color',
          label: '颜色',
          value: '#eee',
          category: '分割线',
        },
        {
          type: 'panel-slider',
          key: 'split-width',
          label: '大小',
          value: 1,
          category: '分割线',
        },
      ]
    }
  ]
}

const defaultOpt = {
  animation: false,
  color: 'rgba(153, 153, 153, .15)',
  grid: {
    left: 0,
    right: 0,
    top: 35,
    bottom: 35,
    containLabel: true
  },
  tooltip: {
    trigger: "axis",
    show: false,
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      fontSize: 12,
    },
  },
  legend:{
    show: true,
    icon:'circle',
    bottom: 7,
    left: 'center',
    itemWidth: 8,
    textStyle:{
      color:'#333',
    }
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisLabel: {
        color: '#333',
      },
      boundaryGap: true
    }
  ],
  yAxis: [
    {
      type: 'value',
      nameTextStyle: {
        color: '#333',
        align: 'left',
      },
      axisLabel: {
        color: '#333',
        formatter: function (value, index) {
          return estimateNumber(value);
        }
      },
      // boundaryGap: [0.2, 0.2],
      splitLine: {
        show: true,
        lineStyle: {
          color: ['#eee'],
          width: 1,
        }
      }
    }
  ],
  series: [
    {
      name: '',
      type: 'bar',
      barMaxWidth: '30',
      data: [],
      itemStyle: {
        barBorderRadius: 0,
      },
      silent: true,
      barWidth: 15
    }
  ]
}

const skeletonOption = {
  animation: false,
  color: 'rgba(153, 153, 153, .15)',
  grid: {
    left: 30,
    right: 30,
    top: 35,
    bottom: 55,
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLabel: {
        show: false
      },
      boundaryGap: true
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: ['rgba(153, 153, 153, .15)']
        }
      }
    }
  ],
  series: [
    {
      name: '直接访问',
      type: 'bar',
      barMaxWidth: '30',
      data: [10, 52, 200, 334, 390, 330, 220],
      itemStyle: {
        barBorderRadius: 0
      },
      silent: true,
      barWidth: 15
    }
  ]
};

export { setting, defaultOpt, skeletonOption, setting as default }