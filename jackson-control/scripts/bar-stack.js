console.log(params)
const barOne = params.data.data[0].slice(1)
const barTwo = params.data.data[0].slice(1)

const barOneSeries = barOne.map((name, index) => ({
  name: name,
  type: 'bar',
  stack: 'one',
  data: params.data.data.slice(1).map(row => row[index + 1])
}))
const barTwoSeries = barTwo.map((name, index) => ({
  name: name,
  type: 'bar',
  stack: 'two',
  data: params.data.data.slice(1).map(row => row[index + 1])
}))

return options = {
  series: [{}, {}, {}, ...barOneSeries, ...barTwoSeries]
}
