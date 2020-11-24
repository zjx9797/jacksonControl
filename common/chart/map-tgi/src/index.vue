<style lang="less" scoped>
  @import url('./less/index.less');
</style>
<style lang="less">
  .async-container-plane.bnr-map-tgi {
    .async-container-plane__title-panel {
      right: 196px;
      width: ~'calc(100% - 196px)';
    }
  }
</style>
<template>
  <div class="map-tgi" ref="tgiBox">
    <g-view-chart
      slot="content"
      ref="map"
      :val="val"
      :options="options"
      :data-complete="dataComplete"
      chart-type="map"
      @click="onClick"
      :skeleton-option="skeletonOption"
      @legendselectchanged="onLegendselectchanged">
    </g-view-chart>

    <e-rank 
      v-if="dataComplete" 
      :e-data='tableData'
      @change="handleRankChange"
    />
  </div>
</template>

<script>
import { defaultOpt, skeletonOption, setting as settingConfig } from './config/setting';
import eRank from './components/rank';
export default {
  name: 'map-tgi',
  props: ['val'],
  inject: ['currentColor', 'mainColorIndex', 'customColorIndex', 'mainColorList', 'customColorList'],
  computed: {
    isEditPage() {
      return (this.$route.path || '').includes('edit');
    },
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
      return this.items.find(_=> _.key === 'self-color-list' ).value || this.matrixColors;
    },
    legendShow() {
      return this.items.find(_=> _.key === 'legend-show' ).value || false;
    },
    tootipShow() {
      return this.items.find(_=> _.key === 'tootip-show' ).value || false;
    },
    deepCopyColor() {
      let v = this._ColorList;
      return JSON.parse(JSON.stringify(v)).reverse();
    },
    valuesShow() {
      return this.items.find(_=> _.key === 'provice-show-value' ).value || false;
    },
    mapBorderColor() {
      return this.items.find(_=> _.key === 'map-border-color' ).value || '#D7D7D7';
    },
  },
  components: {
    eRank,
  },
  watch: {
    tootipShow() {
      this.initChart();
    },
    legendShow() {
      this.initChart();
    },
    _ColorList() {
      this.initChart();
    },
    valuesShow() {
      this.initChart();
    },
    mapBorderColor() {
      this.initChart();
    },
  },
  data() {
    return {
      options: null,
      dataComplete: false,
      valData: null,
      instance: null,
      percentageMap: [],
      tableData: [],
      defaultRank: '',
      skeletonOption: skeletonOption,
      isSeted: false,
      aliasMap: {},
    }
  },
  created() {
    if( !this.isSeted ) {
      this.isEditPage && this.initSetting(  );
      this.isSeted = true;
    }
  },
  mounted() {
    // .async-container-plane__icons
    this.setMatrixHeadClass();
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
      this.valData = data && data.data && data.data.data || [];
      this.aliasMap = $.extend(true, {}, data.colAliasMap || {}, data.aliasMap || {})

      this.initChart();
    },
    initSetting() {
      let color = this.val && this.val.config.find(_=> _.key && _.key == 'color-list');
      if( color ) {
        // 根据当前选项值来变化 若当前已经由用户选择颜色 则不需要重新修改值
        color.items = color.items.map(_=>{
          if( _.colors ) {
            !_.colors.length && (_.colors = this.matrixColors);
            !_.value.length && (_.value = this.matrixColors.slice(0, 3));
          }

          return _;
        })
      }
    },
    getAliasName(str) {
      let alias = this.aliasMap;
      return alias[str] || str;
    },
    transformData(data) {
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
      let opt = {};
      let color = this.deepCopyColor;
      if( this.valData && this.valData.length ) {
        opt = Object.assign({}, defaultOpt);
        
        let _data = this.transformData(this.valData);

        if( !this.defaultRank ) {
          this.defaultRank = _data[1] && _data[1].name;
        }

        let series = [];
        let max = 0;
        let min = 0;
        _data.slice(1).map(_=>{
          if( _.name == this.defaultRank ) {
            let _label = { show: this.valuesShow, formatter: '{c}' };
            let o = {
              ...opt.series[0],
              data: (_.data || []).map(k=>{ let o = k; o.label = _label; return o; }),
              name: _.name,
            }
            o.itemStyle.normal.borderColor = this.mapBorderColor;
            series.push(o);

            let _v = _.data.map(_=> _.value - 0 );
            let _max = Math.max(..._v);
            let _min = Math.max(..._v);
            _max > max && (max = _max)
            _min < min && (min = _min)
          }
        })

        this.tableData = _data.slice(1);
        opt.visualMap[0].min = min || 0;
        opt.visualMap[0].max = max || 0;

        opt.visualMap[0].inRange.color = color;
        opt.series = series;
        opt.color = color;
        opt.tooltip.show = this.tootipShow;
      }

      this.options = opt;
      this.dataComplete = true;
    },
    handleArrayAdd(arr) {
      return arr.reduce((next, current)=> next + current, 0);
    },
    onLegendselectchanged() {

    },
    onClick() {

    },
    handleRankChange(r) {
      this.defaultRank = r;
      this.initChart();
    },
    setMatrixHeadClass() {
      let box = this.$refs['tgiBox'];
      
      $(box).parents('.async-container-plane').addClass('bnr-map-tgi');
    },
  },
  // NOTE: setting 字段建议不要删除
  setting: settingConfig,
}
</script>