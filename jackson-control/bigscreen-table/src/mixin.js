const mixin = {
  created() {
    if (this.val.config && Array.isArray(this.val.config)) {
      const nrPanel = {}
      for (const panel of this.val.config) {
        if (panel.key && !nrPanel[panel.key]) {
          Object.defineProperty(nrPanel, panel.key, {
            configurable: false,
            writable: false,
            value: panel
          })
        }

        if (panel.items && Array.isArray(panel.items)) {
          for (const item of panel.items) {
            if (item.key && !nrPanel[item.key]) {
              Object.defineProperty(nrPanel, item.key, {
                configurable: false,
                writable: false,
                value: item
              })
            }
          }
        }
      }
      Object.defineProperty(this, '$panel', {
        configurable: false,
        writable: false,
        value: nrPanel
      })
    }
  },
  mounted() {
    // FIXME: 只是为了输出结果查看，可以去掉
    // console.log('table header', this.parseTableHeaderStyle())
    // console.log('table content', this.parseTableContentStyle())
    // console.log('table column', this.parseTableColumnStyle())
  },
  methods: {
    _isColumnOnlyStyle(style) {
      return style.startsWith('width')
    },
    // 解析表格表头内联样式
    parseTableHeaderStyle() {
      return `color: ${this.$panel.tableHeaderFrontColor.value}; background-color: ${this.$panel.tableHeaderBackColor.value}`
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

export default mixin
