console.log(params.data)
const standard = params.data[0]
const actual = params.data[1]
const wholeRate = params.data[2]

const result = {
  headerRows: 1,
  headerCols: 1,
  data: []
}

const header = []
const weekArr = standard[0].slice(1).map(date => date.split('-').slice(1).join('-'))
const weekStandardArr = weekArr.map(_ => _ + '[标准]')
header.push(standard[0][0], 'latest_standard')
for (let i = 0; i < weekArr.length; i++) {
  header.push(weekArr[i], weekStandardArr[i])
}
result.data.push(header)

const rowRate = []
rowRate.push('总体符合率', '')
const wholeRateArr = wholeRate.slice(1).map(_ => _[4]).reverse()
for (let i = 0; i < wholeRateArr.length; i++) {
  rowRate.push(Number(wholeRateArr[i]).toFixed(2) * 100 + '%', '')
}
result.data.push(rowRate)

for (let i = 1; i < standard.length; i++) {
  const row = []
  row.push(actual[i][0], standard[i][1])
  for (let j = 1; j < actual[i].length; j++) {
    row.push(actual[i][j], standard[i][j])
  }
  result.data.push(row)
}

return result