import XLSX from 'xlsx'

export default function exportExcel(aoaMap, fileName) {
  const wb = XLSX.utils.book_new()
  Object.entries(aoaMap).forEach(([sheetName, sheetData]) => {
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData)
    XLSX.utils.book_append_sheet(wb, worksheet, sheetName)
  })
  // 字符串转字符流
  const s2ab = function (s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF
    }
    return buf
  }
  // 创建二进制对象写入转换好的字节流
  const tmpDown = new Blob([s2ab(XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' }))], { type: '' })
  var a = document.createElement('a')
  var url = URL.createObjectURL(tmpDown)
  a.href = url
  a.download = fileName
  a.style = 'display: none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  a = null
}
