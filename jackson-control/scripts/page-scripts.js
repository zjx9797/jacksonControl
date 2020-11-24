// 页面脚本
script = {
  editMethods: {},
  methods: {
    cssInit() {
      var _this = this
      var scaleModeBuffer = this.$store.state.page.scaleMode

      var resizer = function () {
        if (window.innerWidth <= 2400) {
          _this.$set(_this.$store.state.page, 'scaleMode', 0)
        } else {
          _this.$set(_this.$store.state.page, 'scaleMode', scaleModeBuffer)
        }
      }
      resizer()
      window.onresize = function () {
        resizer()
      }

      setTimeout(function () {
        $('.lego-container__preview-viewport').css({
          'overflow-x': 'auto'
        })
      }, 1000)

      var style = document.createElement('style')
      style.type = 'text/css'
      style.appendChild(document.createTextNode(
        '.filter-container__radio .el-radio-group .el-radio-button__inner' +
        '{ height: 24px !important; line-height: 24px !important; }'
      ))
      document.getElementsByTagName('head')[0].appendChild(style)
    },
    initTime() {
      const widgets = this.$store.state.widgets
      let wholeTimeUUID
      let moTimeUUID
      widgets.forEach(function(widget) {
        if (widget.title === 'TimeText') {
          wholeTimeUUID = widget.uuid
        }
        if (widget.title === 'TimeTextMo') {
          moTimeUUID = widget.uuid
        }
      })
      function formatDate(time, format) {
        let date = new Date(time)
        let [y, mo, d] = [date.getFullYear(), date.getMonth() + 1, date.getDate()],
          [h, mi, s] = [date.getHours(), date.getMinutes(), date.getSeconds()]
        mo = mo >= 10 ? mo : '0' + mo
        d = d >= 10 ? d : '0' + d
        h = h >= 10 ? h : '0' + h
        mi = mi >= 10 ? mi : '0' + mi
        s = s >= 10 ? s : '0' + s
        if (format == 'yyyy-mm-dd') {
          return y + '-' + mo + '-' + d
        }
        return y + '-' + mo + '-' + d + ' ' + h + ':' + mi + ':' + s
      }
      function getCST() {
        var offset = new Date().getTimezoneOffset()
        return Date.now() + (offset * 60 * 1000 + 8 * 60 * 60 * 1000)
      }
      function init() {
        const wholeTimeDom = document.querySelector('[uuid="' + wholeTimeUUID + '"] > .text-txt')
        const moTimeDom = document.querySelector('[uuid="' + moTimeUUID + '"] > .text-txt')
        if (wholeTimeDom && moTimeDom) {
          // MO 时间
          moTimeDom.innerText = formatDate(getCST() - 1000 * 60 * 60 * 24, 'yyyy-mm-dd')
          // 全局时间转换
          setInterval(function() {
            wholeTimeDom.innerText = formatDate(getCST())
          }, 1000)
        } else {
          setTimeout(() => { init() }, 500)
        }
      }
      setTimeout(() => { init() }, 1000)
    },
    initSelectCss() {
      const style = document.createElement('style')
      style.type = 'text/css'
      style.appendChild(document.createTextNode(`
        .el-select-dropdown {
          background-color: rgb(0, 9, 60) !important;
          border-color: rgba(4, 124, 255, 1);
        }
        
        .el-select-dropdown__list > .el-select-dropdown__item {
          padding: 0 12px;
          font-size: 13px;
          color: rgba(4, 124, 255, 1);
          height: 28px;
          line-height: 28px;
          margin: 2px 0;
          background-color: rgb(0, 9, 60) !important;
        }
        
        .popper-custom-color .el-select-dropdown__item:hover,
        .popper-custom-color .el-select-dropdown__item.hover, 
        .popper-custom-color .el-select-dropdown__item.selected.hover {
          color: #5CC8FF !important;
          background-color: #151E40 !important;
        }
      `))
      document.getElementsByTagName('head')[0].appendChild(style)
    }
  }
}