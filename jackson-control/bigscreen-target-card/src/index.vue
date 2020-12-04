<template>
  <div class="bigscreen-target-card">
    <span class="title" :style="'color:'+ labelColor +';'">{{ titleContent }}</span>
    <el-button v-if="!isRealTime" type="text" :style="'color:'+ labelColor+';font-size:'+labelFontSize+ ';'" @click="emitEvent('ALL')">全部</el-button>
    <el-button type="text" v-for="(item, index) in font" :key="index" @click="emitEvent(item)">
        <i class="label" v-if="item.label" :style="'color:'+ labelColor+';font-size:'+labelFontSize+ ';'">{{ item.label }}:</i>
        <i class="num" :style="'font-size:'+numFontSize+ ';color:'+ color(item, index)">{{ item.num }}</i>
    </el-button>
  </div>
</template>

<script>
import setting from './setting'

export default {
  name: 'bigscreen-text',
  props: ['val'],
  data() {
    return {
      data: [],
      one: '',
      two: '',
      three: '',
      font: [{},{},{}],
      numArr: []
    }
  },
  computed: {
    items() {
      return [].concat(
        ...this.val.config
          .filter((panel) => panel.items)
          .map((panel) => panel.items)
      ); // 获取有 items 者的 items...
    },
    // color() {
    //   return ['red','yellow','#fff']
    // },
    isTime() {
      return this.items.find((_) => _.key == "isTime").value;
    },
    titleContent() {
      return this.items.find((_) => _.key == "titleContent").value;
    },
    isNum() {
      return this.items.find((_) => _.key == "isNum").value;
    },
    isRealTime() {
      return this.items.find((_) => _.key == "isRealTime").value;
    },
    labelFontSize() {
      return this.items.find((_) => _.key == "labelFontSize").value + 'px';
    },
    numFontSize() {
      return this.items.find((_) => _.key == "numFontSize").value + 'px';
    },
    labelColor() {
      return this.items.find((_) => _.key == "labelColor").value;
    },
  },
  mounted() {

  },
  methods: {
    color(item, index) {
      if (this.isNum) {
        let arr = ['#047CFF','#8DC63F','#FFB400']
        return arr[index]
      }
      if(this.isRealTime) {
        let arr = ['red','yellow','#fff']
        return arr[index]
      }
      if (this.isTime) {
        let arr = ['red','yellow','#fff']
        console.log('item,index',item,index);
        if(item.num == 0) {
          return '#fff'
        }else if(item.num == this.numArr[1] && item.num == this.numArr[2]) {
          return 'yellow'
        }else if(item.num == this.numArr[0] && item.num == this.numArr[1]) {
          return 'red'
        }else {
          return arr[this.numArr.indexOf(item.num)]
        }
      }
    },
    emitEvent(value) {
      console.log('111', value);
      if(value!= 'ALL') {
        if(this.isNum) {
          this.$emit('emitDimensions', {
            uuid: this.val.uuid,
            '报警类型': ["{EXP}",value.label]
          })
        }else if(this.isTime) {
          let str = ''
          switch(value.label) {
            case '>12H':
              str = 'FIRST'
              break
            case '4~8H':
              str = 'SECOND'
              break
            case '0~4H':
              str = 'THIRD'
              break
          }
          this.$emit('emitDimensions', {
            uuid: this.val.uuid,
            '告警级别': ["{EXP}",str]
          })
        }
      }else {
        this.$emit('emitDimensions', {
            uuid: this.val.uuid,
            '报警类型': [],
            '告警级别': []
        })
      }
    },
    initComponentsData(data) {
      this.numArr = []
      this.data = data && data.data && data.data.data || null;
      console.log(this.data);
      if(this.isNum) {
        this.font =  [{label: '设备',num: 0},{label: '物料',num: 0},{label: '质量',num: 0}];
      }
      if(this.isRealTime) {
        this.font =  [{label: '超过48h',num: 0},{label: '24h-48h',num: 0},{label: '0h-24h',num: 0}];
      }
      this.data.map((_, i) => {
        if(i === 1 && this.isTime) {
          this.$set(this.font[0], 'label', _[0])
          this.$set(this.font[0], 'num', _[3])
          this.$set(this.font[1], 'label', _[1])
          this.$set(this.font[1], 'num', _[4])
          this.$set(this.font[2], 'label', _[2])
          this.$set(this.font[2], 'num', _[5])
          _.map((a,index) => {
            if(index==3 || index==4 || index==5) {
              this.numArr.push(a)
            }
          })
        }else if(i != 0 && this.isNum) {
          console.log('_', _[0]);
          _[0] == '设备' ? this.$set(this.font[0], 'num', _[1]) : ''
          _[0] == '物料' ? this.$set(this.font[1], 'num', _[1]) : ''
          _[0] == '质量' ? this.$set(this.font[2], 'num', _[1]) : ''
        }else if (i === 1 && this.isRealTime) {
          this.$set(this.font[0], 'num', _[0])
          this.$set(this.font[1], 'num', _[1])
          this.$set(this.font[2], 'num', _[2])
        }
      })
      console.log('ssssssssssssss',this.font, this.numArr, this.numArr.sort(function (a, b) { return b - a }));
    }
  },
  // NOTE: setting 字段建议不要删除
  setting
}

</script>

<style lang="less" scoped>
.bigscreen-target-card {
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  position: relative;
  .title {
    display: inline-block;
    color: #ffffff;
    font-size: 14px;
    line-height: 38px;
    height: 100%;
  }
  .el-button--text {
    flex: 1;
    height: 100%;
    line-height: 100%;
    span {
      display: inline-block;
      height: 100%;
      line-height: 100%;
    }
    div {
      display: inline-block;
    }
  }
  .el-button--text:hover {
    opacity: .6;
  }
}
</style>
