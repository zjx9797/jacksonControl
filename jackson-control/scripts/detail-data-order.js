function graph() {
  const result = [params.data[0]]
  const monthOrder = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  monthOrder.forEach(month => {
    const monthText = `${month}月`
    const index = params.data.findIndex(_ => _[0] === monthText)
    if (index) {
      result.push(params.data[index])
    } else {
      result.push([monthText].concat(new Array(params.data[0].length - 1).fill(0)))
    }
  })
  return { data: result }
}

function table() {
  const result = []
  const monthOrder = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  params.data.forEach(row => {
    result.push([].concat(row.slice(0, row.length - 12)))
  })
  monthOrder.forEach(month => {
    const monthText = `${month}月`
    result[0].push(monthText)
    const index = params.data[0].findIndex(_ => _ === monthText)
    let newIndex = 1
    params.data.slice(1).forEach(rowData => {
      if (index === -1) {
        result[newIndex].push(0)
      } else {
        result[newIndex].push(rowData[index])
      }
      newIndex++
    })
  })
  return { data: result }
}