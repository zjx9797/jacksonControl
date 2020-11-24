// 生成数据对应的经纬度坐标
const fs = require('fs')
const path = require('path')

const regions = require('./region')
const jsRegions = fs.readFileSync(path.join(__dirname, 'region-from-js.txt'), { encoding: 'utf8' })

const jsRegionsArr = jsRegions.split('\n').filter(_ => !!_).map(_ => _.trim())

const special = {
  '耿马市': '耿马傣族佤族自治县',
  '伊犁市': '伊犁哈萨克自治州',
  '胶南市': [119.980166, 35.854016],
  '芦台市': [114.508851,37.0682],
  '潞西市': [98.486572,24.418678],
  '穆林市': [130.524437,44.918813],
  '纳河市': [125.023207,48.140807],
  '西咸新区市': [108.787759,34.252258],
  '襄樊市': [112.144146,32.042426],
  '新疆其他城市': [87.617733,43.792818],
  '燕郊市': [116.80954,39.944924],
  '杨凌市': '杨陵区'
}

// 暴力搜索
const posRegionsArr = []
regions.districts.forEach(province => {
  posRegionsArr.push({
    name: province.name,
    center: province.center
  })
  province.districts.forEach(city => {
    posRegionsArr.push({
      name: city.name,
      center: city.center
    })
    city.districts.forEach(district => {
      posRegionsArr.push({
        name: district.name,
        center: district.center
      })
    })
  })
})

const result = {}
const unhandled = []
jsRegionsArr.forEach(jsRegion => {
  const found = posRegionsArr.find(_ => _.name === jsRegion)
  const againFound = posRegionsArr.find(_ => {
    if ((_.name[_.name.length - 1] === '县' || _.name[_.name.length - 1] === '区') &&
      jsRegion[jsRegion.length - 1] === '市' &&
      _.name.substring(0, _.name.length - 1) === jsRegion.substring(0, jsRegion.length - 1)) {
      return true
    }
    if (jsRegion + '市' === _.name) {
      return true
    }
    if (jsRegion + '区' === _.name) {
      return true
    }
  })

  if (special[jsRegion]) {
    if (typeof special[jsRegion] === 'string') {
      const found = posRegionsArr.find(_ => _.name === special[jsRegion])
      result[jsRegion] = [found.center.longitude, found.center.latitude]
    } else {
      result[jsRegion] = special[jsRegion]
    }
  } else if (found) {
    result[jsRegion] = [found.center.longitude, found.center.latitude]
  } else if (againFound) {
    result[jsRegion] = [againFound.center.longitude, againFound.center.latitude]
  } else {
    result[jsRegion] = []
    unhandled.push(jsRegion)
  }
})

fs.writeFileSync(path.join(__dirname, '../src/assets/pos.json'), JSON.stringify(result), { encoding: 'utf8' })
console.log(`写入成功，遗留未匹配数据 ${unhandled.length} 条`)
console.log(unhandled)
