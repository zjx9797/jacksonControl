/**
 * 方便快捷地获取方舟配置项的 $panel 对象
 *
 * Note: 这并不是一个 Observable
 */
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
  }
}

export default mixin
