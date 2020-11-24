const date = new Date()
let year = date.getFullYear()
const month = date.getMonth()
// 十月之后
if (month >= 9) {
  year++
}
return [[
  { key: `FY${year % 2000}` },
  { key: `FY${(year - 1) % 2000}` },
  { key: `FY${(year - 2) % 2000}` }
]]