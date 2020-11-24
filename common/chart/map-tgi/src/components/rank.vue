<template>
  <div class="rank-box">
    <div class="rank-box-pos">
      <div class="rank-box__header" v-if="hasData">
        <el-radio-group class="btn" 
          v-model="locNav"
          @change="handleChange"
        >
          <el-radio-button 
            v-for="(item, index) in navData" 
            :key="index"
            @click="setRankData(item)"
            :label='item'
          >
            {{ $tt(item) }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="rank-box__content">
        <div class="empty" v-if="notTableData">
          {{ $tt('暂无数据') }}
        </div>
        <el-table v-else 
          :data='tableData'
          width='100%'
        >
          <el-table-column
            type='index'
            label=" "
            width="30"
          >
          </el-table-column>
          <el-table-column
            property="name"
            :label="$tt('省份/城市')"
            width="90"
          >
          </el-table-column>
          <el-table-column
            property="value"
            width="70"
            :label="$tt(locNav)"
          >
            <template slot-scope="scope">
              {{ scope.row.value | formatNumber }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { formatNumber } from '../config/fn';
export default Vue.extend({
  props: {
    eData: {
      type: Array,
      default: [],
    }
  },
  filters: {
    formatNumber
  },
  computed: {
    hasData() {
      return this.eData && this.eData.length;
    },
    navData() {
      return this.eData.map(_=> _.name );
    },
    tableData() {
      let d = this.eData.find(_=> _.name === this.locNav )

      return (d && d.data || []).sort((a, b)=> b.value - a.value )
    },
    notTableData() {
      return !this.tableData.length;
    },
  },
  data() {
    return {
      locNav: '',
    }
  },
  created() {
    this.eData.length && (this.locNav = this.eData[0].name)
  },
  mounted() {
  },
  methods: {
    handleChange(val) {
      this.$emit('change', val);
    }
  }
})
</script>