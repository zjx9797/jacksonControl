/*************下载csv************* */
export default function (fileName, data) {
  var seq = (navigator.appName === 'Microsoft Internet Explorer') ? '\t' : ','
  var csvData = []
  for (var i = 0; i < data.length; i++) {
    csvData.push(data[i].map(function (col) {
      return (col + '').replace(/,/g, '，')
    }).join(seq))
  }
  csvData = csvData.join('\n')

  if (navigator.appName === 'Microsoft Internet Explorer' && !navigator.msSaveBlob) { // IE10以下
    var new_iframe = document.createElement('iframe')
    new_iframe.src = 'about:blank'
    window.document.body.appendChild(new_iframe)
    var iframe = new_iframe.contentWindow || new_iframe.contentDocument
    iframe.document.open('text/csv')
    iframe.document.write(csvData)
    iframe.document.close()
    iframe.focus()
    iframe.document.execCommand('SaveAs', 'true', fileName)
    window.document.body.removeChild(new_iframe)
  } else {
    var url
    if (window.Blob) {
      //加BOM
      var blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=UTF-8' })
      if (navigator.msSaveBlob) { // IE10
        return navigator.msSaveBlob(blob, fileName)
      }
      url = window.URL.createObjectURL(blob)
    } else {
      url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvData)
    }
    var a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.style = 'display:none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    if (window.Blob) {
      window.URL.revokeObjectURL(url)
    }
    a = null
  }
}
