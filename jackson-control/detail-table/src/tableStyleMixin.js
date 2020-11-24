export default {
  methods: {
    _isColumnOnlyStyle(style) {
      return style.startsWith('width')
    },
    // 解析表格列内联样式（只有 width）
    parseTableColumnStyle() {
      const sourceStyleText = this.$panel.tableContentStyle.value.trim()
      if (!sourceStyleText) {
        return {}
      }
      const style = {}
      let currentColumn = null
      const lines = sourceStyleText.split('\n').map(_ => _.trim()).filter(_ => !!_)
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('[') && lines[i].endsWith(']')) {
          const column = lines[i].substring(1, lines[i].length - 1).trim()
          style[column] = []
          currentColumn = style[column]
        } else if (currentColumn && this._isColumnOnlyStyle(lines[i])) {
          currentColumn.push(lines[i])
        }
      }

      const result = {}
      for (const key in style) {
        result[key] = style[key].join(' ')
      }
      return result
    },
    // 解析表格内容内联样式（除去 width）
    parseTableContentStyle() {
      const sourceStyleText = this.$panel.tableContentStyle.value.trim()
      if (!sourceStyleText) {
        return {}
      }
      const style = {}
      let currentColumn = null
      const lines = sourceStyleText.split('\n').map(_ => _.trim()).filter(_ => !!_)
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('[') && lines[i].endsWith(']')) {
          const column = lines[i].substring(1, lines[i].length - 1).trim()
          style[column] = []
          currentColumn = style[column]
        } else if (currentColumn && !this._isColumnOnlyStyle(lines[i])) {
          currentColumn.push(lines[i])
        }
      }

      const result = {}
      for (const key in style) {
        result[key] = style[key].join(' ')
      }
      return result
    }
  }
}