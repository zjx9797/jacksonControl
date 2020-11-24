// 客户体验看板 - 数据过滤脚本
function filter(params) {
  const rows = params.data[0].rows
  const table = params.data[0].table

  const result = {
    headerCols: 1,
    headerRows: 1,
    data: []
  }

  // 表头
  result.data.push(['sales_office'].concat(params.data[0].columns))
  const handlingData = []
  rows.forEach((row, index) => {
    if (!row) {
      return
    }

    const datasetRow = [
      row,
      table[index][0].sum,
      table[index][1].sum,
      Number(table[index][0].sum) + Number(table[index][1].sum)
    ]
    handlingData.push(datasetRow)
  })
  // 取 sum 倒序取 Top30
  handlingData.sort((prev, next) => next[3] - prev[3])
  handlingData.forEach(_ => {
    _.pop()
  })
  result.data = result.data.concat(handlingData.slice(0, 30))

  return result
}