<style lang="less" scoped>
@import url("./less/index.less");
</style>
<template>
  <div class="pie-tgi" ref="tgiBox" :class="boxIs2Less ? 'too-less' : ''" :style="chartStyle">
      <g-view-chart
        slot="content"
        ref="pie"
        :val="val"
        :options="options"
        :data-complete="dataComplete"
        chart-type="pie"
        @click="onClick"
        :skeleton-option="skeletonOption"
        @legendselectchanged="onLegendselectchanged"
      ></g-view-chart>
    <template v-if="dataComplete && showIcon">
      <div
        class="show-percentage"
        v-for="(item, index) in percentageMap"
        :key="index"
        :class="item.type"
        :style="{
          '--color': item.color
        }"
      >
        <i class="show-percentage-icon femalesolid" :class="'ds-icon-'+ item.type +'solid'"></i>

        <div class="show-percentage-items">
          <span class="label">{{ $tt('占比') }}:</span>
          <span class="number">{{ item.proportion }}</span>
        </div>

        <h4 class="show-percentage-tgi">
          <span class="label">{{ $tt(item.tgiLabel) }}:</span>
          <span class="number">{{ item.tgi }}</span>
        </h4>
      </div>
    </template>
  </div>
</template>

<script>
import {
  defaultOpt,
  formatNumber,
  skeletonOption,
  setting as settingConfig
} from "./config/setting";
export default {
  name: "pie-tgi",
  props: ["val", "publicThemeConf"],
  inject: [
    "currentColor",
    "mainColorIndex",
    "customColorIndex",
    "mainColorList",
    "customColorList"
  ],
  computed: {
    backgroundColor() {
      return this.items.find(_ => _.key === "backgroundColor").value;
    },
    chartStyle() {
      return this.getStyle(this.items.filter(panel => panel.items));
    },
    items() {
      return [].concat(
        ...this.val.config
          .filter(panel => panel.items)
          .map(panel => panel.items)
      ); // 获取有 items 者的 items...
    },
    _mainColorList() {
      // 主题色盘
      return this.mainColorList();
    },
    _customColorList() {
      // 自定义色盘
      return this.customColorList();
    },
    matrixColors() {
      return (
        (this._customColorList.length && this._customColorList) ||
        this._mainColorList
      );
    },
    _ColorList() {
      return (
        this.items.find(_ => _.key === "self-color-list").value ||
        this.matrixColors
      );
    },

    radiusMap() {
      let o = this.items
        .filter(_ => _.key === "radius-outter")
        .sort((a, b) => {
          return a.value - b.value;
        })
        .map(_ => _.value);
      let i = this.items
        .filter(_ => _.key === "radius-inner")
        .sort((a, b) => {
          return a.value - b.value;
        })
        .map(_ => _.value);

      let p = this.boxRelative;
      return [o.map(_ => _ + "%"), i.map(_ => _ + "%")];
    },
    startAngle() {
      return this.items.filter(_ => _.key === "startAngle").value || 90;
    },
    legendShow() {
      return this.items.find(_ => _.key === "legend-show").value || false;
    },
    labelShow() {
      return this.items.find(_ => _.key === "label-count-show").value || false;
    },
    labelNameshow() {
      return this.items.find(_ => _.key === "label-name-show").value || false;
    },
    tootipShow() {
      return this.items.find(_ => _.key === "tootip-show").value || false;
    },
    tootipPercentage() {
      return (
        (this.tootipShow &&
          this.items.find(_ => _.key === "tootip-show_percentage").value) ||
        false
      );
    },
    showIcon() {
      return this.items.find(_ => _.key === "show-icon").value || false;
    },
    maxRadius() {
      return Math.max(...this.radiusMap.flat().map(_ => parseFloat(_)));
    }
    // outterBoxSize() {
    //   let s = this.boxSize;
    //   return [s[0]+ 40, s[1]+ 8]; // 宽度padding20px 高度差8px
    // },
    // // 相对百分比计算
    // boxRelative() {
    //   let s = this.boxSize;
    //   let o = this.outterBoxSize;
    //   return s.map((_, i)=>{
    //     return _ != 0 && o[i] / _ || 0;
    //   })
    // },
  },
  watch: {
    _ColorList() {
      this.initChart();
    },
    radiusMap() {
      this.initChart();
    },
    startAngle() {
      this.initChart();
    },
    labelShow() {
      this.initChart();
    },
    labelNameshow() {
      this.initChart();
    },
    tootipShow() {
      this.initChart();
    },
    legendShow() {
      this.initChart();
    },
    isEditPage() {
      return (this.$route.path || "").includes("edit");
    },
    "$i18n.locale"() {
      // 切换中英文
      this.initChart();
    }
  },
  data() {
    return {
      options: null,
      dataComplete: false,
      valData: null,
      instance: null,
      percentageMap: [],
      boxIs2Less: false,
      skeletonOption: skeletonOption,
      aliasMap: {},
      boxSize: [0, 0]
    };
  },
  created() {
    this.isEditPage && this.initSetting();
    // console.log("publicThemeConf", this.publicThemeConf);
    // console.log("this.val.config", this.val.config);
    // console.log("this items", this.items);
  },
  mounted() {
    if (this.showIcon) {
      this.initResize();
      this.$nextTick(() => {
        window.addEventListener("resize", this.initResize, false);
      });
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.initResize, false);
  },
  methods: {
    getStyle(items) {
      let ret = {};
      items.forEach(_ => {
        if (_.items) {
          let parentKey = _.key || "";
          _.items.forEach(_ => {
            let key = _.css ? `--${parentKey}-${_.css}` : "";
            if (key && ret[key]) {
              ret[key] += ` ${_.value}${_.unit || ""}`;
            } else if (key) {
              ret[key] = `${_.value}${_.unit || ""}`;
            }
          });
        } else {
          let key = _.css ? `--${_.css}` : "";
          if (key && ret[key]) {
            ret[key] += ` ${_.value}${_.unit || ""}`;
          } else if (key) {
            ret[key] = `${_.value}${_.unit || ""}`;
          }
        }
      });
      // items.forEach(_ => {
      //   if (ret[_.css]) {
      //     ret[_.css] += ` ${_.value}${_.unit || ""}`;
      //   } else {
      //     ret[_.css] = `${_.value}${_.unit || ""}`;
      //   }
      // });
      return ret;
    },
    getDomSize() {
      let d = this.$refs["tgiBox"];
      return [d.offsetWidth || 0, d.offsetHeight || 0];
    },
    // 外面筛选器改变时调用此方法
    /* eslint-disable no-unused-vars */
    initCustomFilterParams(params) {
      // console.log(params)
    },
    // 内部筛选器改变时发射事件
    emitCustomFilterParams(params) {
      this.$emit("emitCustomFilterParams", params);
    },
    // 外部数据渲染
    /* eslint-disable no-unused-vars */
    initComponentsData(data) {
      this.dataComplete = false;
      this.valData = (data && data.data && data.data.data) || [];
      if (this.valData.length) {
        const _sort = ["男", "女"];
        this.valData = [
          this.valData[0],
          ...this.valData.slice(1).sort((a, b) => {
            let _a = _sort.indexOf(a[0]);
            let _b = _sort.indexOf(b[0]);
            return _a - _b;
          })
        ];
      }

      this.aliasMap = $.extend(
        true,
        {},
        data.colAliasMap || {},
        data.aliasMap || {}
      );
      this.initChart();
    },
    initSetting() {
      let color =
        this.val && this.val.config.find(_ => _.key && _.key == "color-list");
      if (color) {
        // 根据当前选项值来变化 若当前已经由用户选择颜色 则不需要重新修改值
        color.items = color.items.map(_ => {
          if (_.colors) {
            !_.colors.length && (_.colors = this.matrixColors);
            // !_.value.length && (_.value = this.matrixColors.slice(0, 2));
          }

          return _;
        });
      }
    },
    getAliasName(str) {
      let alias = this.aliasMap;
      return alias[str] || str;
    },
    transformData(data) {
      let _res = [];
      data.map((item, index) => {
        item.map((_, i) => {
          if (index === 0) {
            _res.push({
              name: this.$tt(this.getAliasName(_)),
              data: []
            });
          } else {
            _res[i].data.push({
              value: _ - 0 || 0,
              name: this.$tt(this.getAliasName(item[0]))
            });
          }
        });
      });
      return _res;
    },
    initChart() {
      this.dataComplete = false;
      let opt = {};
      if (this.valData && this.valData.length) {
        opt = Object.assign({}, defaultOpt);

        let data = [...this.valData];
        if (this.showIcon) {
          this.getProportion(data);
        }

        let legend = [];
        if (data.length) {
          const _sort = ["女", "男"];
          data = [
            data[0],
            ...data.slice(1).sort((a, b) => {
              let _a = _sort.indexOf(a[0]);
              let _b = _sort.indexOf(b[0]);
              return _a - _b;
            })
          ];

          legend = data.slice(1).map(_ => _[0]);
        }
        let _data = this.transformData(data);
        // 最后组合成的_map是 0--品牌 == legend
        // 之后的是品牌对应的数据 == series
        let series = [];
        let c = this._ColorList;
        c = [...c].reverse();

        // 目前值在第一个
        _data.slice(1).map((_, i) => {
          series.push({
            startAngle: this.startAngle,
            ...opt.series[0],
            label: {
              show: (0 == i && this.labelShow) || false,
              formatter: d => {
                const {
                  data: {
                    itemStyle: { color }
                  }
                } = d;
                const marker = ``;
                return `${marker} ${(this.labelNameshow && d.name + "\n") ||
                  ""}${d.percent}%`;
              }
            },
            itemStyle: {
              borderWidth: 2,
              borderColor: this.backgroundColor ,
            },
            hoverOffset: i === 0 ? 10 : 8,
            radius: this.radiusMap[i] || opt.series[0].radius,
            // center: [''],
            name: _.name,
            // data: _.data,
            data: _.data.map((v, _i) => {
              return {
                ...v,
                itemStyle: {
                  color: c[_i % c.length]
                }
              };
            })
          });
        });

        opt.tooltip.show = this.tootipShow;
        // opt.tooltip.formatter = `{a}<br/>{b}: {c}${ this.tootipPercentage && '({d}%)' || '' }`;
        opt.tooltip.formatter = k => {
          return `${k.marker} ${k.seriesName}<br/>
            ${k.name}: ${formatNumber(k.value)}${(this.tootipPercentage &&
            "(" + k.percent + "%)") ||
            ""}
          `;
        };

        if (legend.length) {
          const _sort = ["男", "女"];
          legend = legend.sort((a, b) => {
            let _a = 0,
              _b = 0;
            if (a.includes("男")) _a = 1;
            if (b.includes("女")) _b = -1;

            return _b - _a;
          });
        }
        opt.legend.data = legend;
        opt.legend.show = this.legendShow;
        opt.series = series;
        opt.color = this._ColorList;
        // opt.startAngle = 180;//this.startAngle;
      }

      this.options = opt;
      // console.log(this.options);
      this.dataComplete = true;
    },
    getProportion(data) {
      let _data = data.slice(1);

      // TODO 这个要怎么规范 把普通放第一个 TGI放第二个
      let sumArray = _data.map(_ => _[1] - 0 || 0);
      let allPer = [];
      let sum = this.handleArrayAdd(sumArray);
      this.percentageMap = [];
      _data.map((item, i) => {
        if (item[0] && (item[0].includes("男") || item[0].includes("女"))) {
          let _ = sumArray[i];

          let p = 0;
          if (sum != 0) {
            p = Math.round((_ / sum) * 10000) / 100; // 保留两位小数
          }
          if (i === sumArray.length - 1) {
            p = Math.round(100 * 100 - this.handleArrayAdd(allPer) * 100) / 100;
          }

          allPer.push(p);
          // 目前仅考虑两个
          let c = this._ColorList;
          this.percentageMap.push({
            type: (item[0].includes("男") && "male") || "female",
            value: _,
            proportion: p + "%",
            color: c[i % c.length],
            tgi: _data[i][2], // 此处需要做对照 目前不知道有什么好的办法对比成2
            tgiLabel: this.$tt(item[0]) + data[0][2] || ""
          });
        }
      });
    },
    handleArrayAdd(arr) {
      return arr.reduce((next, current) => next + current, 0);
    },
    onLegendselectchanged() {},
    onClick(e) {
      const { seriesIndex, seriesName, dataIndex} = e;
      let instance = this.$refs["pie"].instance
      // console.log(instance,e)
      // console.log('e',instance.getModel().getSeriesByIndex(0).getData())
      if (instance &&seriesName) {
        instance.dispatchAction({
          type: 'downplay'
        });
        instance.dispatchAction({
          type: 'highlight',
          seriesIndex,
          seriesName,
          dataIndex,
        });

      }
    },
    initResize() {
      this.boxSize = this.getDomSize();
      let dom = this.boxSize[0];

      let pWidth =
        $(dom)
          .find(".show-percentage")
          .width() || 54; // 百分比大小
      if ((pWidth * 2 * 100) / dom + 5 >= 100 - this.maxRadius) {
        // 当前没有剩余位置
        this.boxIs2Less = true;
      } else {
        this.boxIs2Less = false;
      }
    }
  },
  // NOTE: setting 字段建议不要删除
  setting: settingConfig
};
</script>