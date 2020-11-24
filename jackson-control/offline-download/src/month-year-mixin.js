export default {
  data() {
    let year = new Date().getFullYear() % 2000
    const month = new Date().getMonth() + 1
    if (month >= 10) {
      year++
    }
    const yearOptions = [`FY${year}`, `FY${year - 1}`, `FY${year - 2}`]
    const monthOptions = ['10月', '11月', '12月', '1月', '2月', '3月', '4月',
      '5月', '6月', '7月', '8月', '9月'
    ]

    return {
      monthYearLoading: false,
      yearOptions,
      monthOptions,
      selectedYear: `FY${year}`,
      selectedMonth: `${month}月`
    }
  },
  computed: {
    useYearMonth() {
      return ['AVERAGE_DAY_IN_WAREHOUSE', 'INVENTORY_AGING_ANALYSIS'].includes(this.graphKey)
    },
    yearMonthLabel() {
      if (this.graphKey === 'AVERAGE_DAY_IN_WAREHOUSE') {
        return '观察月份'
      }
      if (this.graphKey === 'INVENTORY_AGING_ANALYSIS') {
        return '账龄数据'
      }
    }
  },
  methods: {
    async downloadMonthYear() {
      const params = {
        graphKey: this.graphKey,
        conditionJson: JSON.stringify([{
          field: 'stats_fiscal_year',
          termValue: this.selectedYear
        }, {
          field: 'stats_fiscal_month',
          termValue: this.selectedMonth
        }]),
        accountId: this.accountId
      }
      console.log('请求参数', params)
      this.monthYearLoading = true
      const res = await this.sendAjax(params)
      this.monthYearLoading = false
      if (res.success) {
        this.$message.success(res.message)
      } else {
        this.$message.error(res.message)
      }
    },
  }
}
