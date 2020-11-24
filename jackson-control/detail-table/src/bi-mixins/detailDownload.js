// 平均计划达成率明细下载，返回二维数据
const detailDownload = (list, aliasArr) => {
  if (!list || list.length === 0) {
    return []
  }

  const head = []
  const body = []

  list.forEach(obj => {
    const rowData = []
    aliasArr.forEach(({ column, name }) => {
      rowData.push(obj[column])
    })
    body.push(rowData)
  })

  return [
    aliasArr.map(_ => _.name),
    ...body
  ]
}

const avgDayDetailDownload = (list, aliasArr) => {
  // TODO: 看看返回的格式
}

export {
  detailDownload,
  avgDayDetailDownload
}

