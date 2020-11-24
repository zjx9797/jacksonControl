<style lang="less" scoped>
  @import url('./less/index.less');
</style>
<template>
  <div class="bar-tgi">
    <g-view-chart
      slot="content"
      :ref="val.uuid + 'bar'"
      :key="val.uuid + 'bar'"
      :val="val"
      :options="options"
      :data-complete="dataComplete"
      chart-type="bar"
      @click="onClick"
      :skeleton-option="skeletonOption"
      @legendselectchanged="onLegendselectchanged">
    </g-view-chart>
  </div>
</template>

<script>
import { defaultOpt, skeletonOption, setting as settingConfig } from './config/setting';
export default {
  name: 'bar-tgi',
  props: ['val'],
  inject: ['currentColor', 'mainColorIndex', 'customColorIndex', 'mainColorList', 'customColorList'],
  computed: {
    items() {
      return [].concat(...this.val.config.filter(panel => panel.items).map(panel => panel.items)) // 获取有 items 者的 items...
    },
    _mainColorList() {// 主题色盘
      return this.mainColorList();
    },
    _customColorList() {// 自定义色盘
      return this.customColorList();
    },
    matrixColors() {
      return this._customColorList.length && this._customColorList || this._mainColorList;
    },
    _ColorList() {
      return this.items.filter(_=> _.key === 'self-color-list' ).value || this.matrixColors;
    },
    legendShow() {
      return this.items.find(_=> _.key === 'legend-show' ).value || false;
    },
    tootipShow() {
      return this.items.find(_=> _.key === 'tootip-show' ).value || false;
    },
    radiusWidth() {
      return this.items.find(_=> _.key === 'radius-width' ).value || 0;
    },
    barWidth() {
      return this.items.filter(_=> _.key === 'bar-width' ).map(_=> _.value || 10 );
    },
    splitColor() {
      return this.items.filter(_=> _.key === 'split-color' ).map(_=> _.value || '#eee' );
    },
    splitWidth() {
      return this.items.find(_=> _.key === 'split-width' ).value || 0;
    },
  },
  watch: {
    tootipShow() {
      this.initChart();
    },
    legendShow() {
      this.initChart();
    },
    radiusWidth() {
      this.initChart();
    },
    barWidth() {
      this.initChart();
    },
    splitWidth() {
      this.initChart();
    },
    splitColor() {
      this.initChart();
    },
    '$i18n.locale'() { // 切换中英文
      this.initChart();
    },
  },
  data() {
    return {
      options: {},
      dataComplete: false,
      valData: null,
      instance: null,
      percentageMap: [],
      skeletonOption: skeletonOption,
      aliasMap: {},
    }
  },
  created() {
    this.initSetting();
  },
  mounted() {
  },
  methods: {
    // 外面筛选器改变时调用此方法
    /* eslint-disable no-unused-vars */
    initCustomFilterParams(params) {
      // console.log(params)
    },
    // 内部筛选器改变时发射事件
    emitCustomFilterParams(params) {
      this.$emit('emitCustomFilterParams', params)
    },
    // 外部数据渲染
    /* eslint-disable no-unused-vars */
    initComponentsData(data) {
      this.dataComplete = false;
      const newData = data && data.data && data.data.data || [];
      this.valData = $.extend(true, [], newData)

      this.aliasMap = data && $.extend(true, {}, data.colAliasMap || {}, data.aliasMap || {}) || {};
      this.initChart();
    },
    initSetting() {
      let color = this.val && this.val.config.find(_=> _.key && _.key == 'color-list');
      if( color ) {
        // 根据当前选项值来变化 若当前已经由用户选择颜色 则不需要重新修改值
        color.items = color.items.map(_=>{
          if( _.colors ) {
            !_.colors.length && (_.colors = this.matrixColors);
            !_.value.length && (_.value = this.matrixColors);
          }

          return _;
        })
      }
    },
    getAliasName(str) {
      let alias = this.aliasMap;
      return alias[str] || str;
    },
    transformData(arr) {
      let data =$.extend(true, [], arr)
      let res = [];

      data.map((item, index)=>{
        item.map((_, i)=>{
          if( index === 0 ) {
              res.push({
                name: this.$tt(this.getAliasName(_)),
                data: [],
              })
          } else {
            res[i].data.push({
              value: (_ - 0) || 0,
              name: this.$tt(this.getAliasName(item[0])),
            });
          }
        })
      })
      return res;
    },
    initChart() {
      this.dataComplete = false;
      this.options = {}
      let opt = {};
      let xAxis = []
      if( this.valData && this.valData.length ) {
        opt = Object.assign({}, defaultOpt);
        
        let _data = this.transformData(this.valData);
        let series = [];
        let yAxis = [];
        _data.slice(1).map((_, i)=>{
          let _max = Math.max(..._.data.map(_=> _.value ));

          _max = _max + Math.ceil(_max / 5 / 3) // 在最高基础上多加1/3
          let _y = {
            ...opt.yAxis[0],
            name: _.name,
            min: 0,
            max: _max,
            interval: Math.ceil(_max / 5), // 手动切割成5分,
            position: i == 0 && 'left' || 'right'
          };
          _y.splitLine.show = (i === 0) && true || false;
          _y.splitLine.lineStyle.color = this.splitColor;
          _y.splitLine.lineStyle.width = this.splitWidth;

          yAxis.push($.extend(true, {}, _y) );

          let bw = this.barWidth;
          let _se = {
            ...opt.series[0],
            yAxisIndex: i,
            barWidth: bw[i % bw.length],//i == 0 && 10 || 3,
            // label: {
            //   show: 0 == i && this.labelShow || false,
            //   formatter: (d)=>{
            //     return `${ this.labelNameshow && d.name +'\n' || '' }${ d.percent }%`
            //   },
            // },
            name: _.name,
            data: _.data,
          };
          _se.itemStyle.barBorderRadius = this.radiusWidth;
          series.push(_se)
        })
        opt.tooltip.show = this.tootipShow;
        // opt.tooltip.formatter = `{a}<br/>{b}: {c}${ this.tootipPercentage && '({d}%)' || '' }`;
        opt.legend.show = this.legendShow;
        opt.series = series;
        opt.yAxis = yAxis;
        xAxis = [{
          data: _data[0].data.map(_=> _.name )
        }]
        opt.grid.left = this.$i18n.locale == 'en' && 10 || 0;
        opt.color = this._ColorList.slice(0,series.length);
      }
      this.options = opt;
      this.$set(this.options,'xAxis',xAxis)
      console.log('this.valData1:',$.extend(true, [], this.valData))
      console.log('opt1:', this.options)
      console.log('opt2:',$.extend(true, {}, this.options))
      this.dataComplete = true;
    },
    handleArrayAdd(arr) {
      return arr.reduce((next, current)=> next + current, 0);
    },
    onLegendselectchanged() {

    },
    onClick() {

    },
  },
  // NOTE: setting 字段建议不要删除
  setting: settingConfig,
}
</script>