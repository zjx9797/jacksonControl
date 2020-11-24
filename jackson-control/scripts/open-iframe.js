/** 页面初始化脚本 */
const maxWidth = 1280   // 最大宽度 px

// 方舟正式环境参数
// const projectId = 1143   // 项目 ID 一般不用改
// const bgId = 2354        // 背景图 ID（无须更改）
// const leftPic = 2355     // 左边图片
// const rightPic = 2356    // 右边图片

// 我的测试环境参数
// const projectId = 329   // 项目 ID 一般不用改
// const bgId = 417        // 背景图 ID（无须更改）
// const leftPic = 418     // 左边图片
// const rightPic = 419    // 右边图片

// 江森正式环境参数
const projectId = 338    // 项目 ID 一般不用改
const bgId = 2166        // 背景图 ID（无须更改）
const leftPic = 2167     // 左边图片
const rightPic = 2168    // 右边图片

const animationSeconds = 0.5  // 动画时长
const hoverTextColor = '#bdf2ff'

// 配置不同文本组件跳转的页面 ID
const textContentMapping = {
  '库存仓库什么鬼': 2423,
  '我自己': 976
}

const textContentMapping = {
  '月平均计划达成率': 3250
}

script = {
  methods: {
    initIframe() {
      const wrapper = document.createElement('div')
      const block = document.createElement('div')
      wrapper.style = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.65);
        z-index: 10000;
        display: none;
      `
      block.style = `
        position: absolute;
        top: 0;
        bottom: 0;
        width: 33.3%;
        overflow: hidden;
      `

      const div = document.createElement('div')
      const header = document.createElement('div')
      const body = document.createElement('div')
      const iframe = document.createElement('iframe')
      const loadingTips = document.createElement('div')
      const leftImage = document.createElement('img')
      const rightImage = document.createElement('img')

      leftImage.src = `/frontApp/get?id=${leftPic}`
      rightImage.src = `/frontApp/get?id=${rightPic}`
      leftImage.style = `
        position: absolute;
        left: -7px;
        top: -17px;
        height: 107%;
        transition: all ${animationSeconds}s linear;
      `
      rightImage.style = `
        position: absolute;
        right: -7px;
        top: -17px;
        height: 107%;
        transition: all ${animationSeconds}s linear;
      `

      div.style = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        height: 640px;
        max-width: ${maxWidth}px;
        overflow: visible;
      `

      body.style = `
        width: 100%;
        height: 100%;
        background-color: #000436;
        position: relative;
        overflow: visible;
        transition: all ${animationSeconds}s linear;
        transform-origin: center center;
        padding: 10px;
        box-sizing: border-box;
      `

      iframe.style = `
        width: 100%;
        height: 100%;
        display: block;
        position: relative;
        z-index: 1;
      `

      wrapper.addEventListener('click', function() {
        wrapper.style.display = 'none'
      })

      const bg = document.createElement('img')
      bg.src = `/frontApp/get?id=${bgId}`
      bg.style = `
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 2;
        pointer-events: none;
        transform: translateY(-10px);
      `
      body.appendChild(bg)
      body.appendChild(iframe)

      div.appendChild(body)
      div.appendChild(leftImage)
      div.appendChild(rightImage)

      block.appendChild(div)

      wrapper.appendChild(block)

      document.querySelector('.lego-container__viewport-holder').appendChild(wrapper)
      window.openIframe = function(pageId, currentX) {
        iframe.src = '/#/lego/' + projectId + '/0/preview/' + pageId
        body.style.transform = 'scale(0, 1)'
        let translateWidth
        if (window.innerWidth <= 2400) {
          block.style.width = '100%'
          block.style.left = '0'
          translateWidth = 640
        } else {
          const popupWidth = parseInt(document.documentElement.clientWidth / 3 * 0.9)
          if (popupWidth > 1280) {
            translateWidth = 640
          } else {
            translateWidth = popupWidth / 2
          }

          const threshold = document.documentElement.clientWidth / 3
          if (currentX < threshold) {
            block.style.left = '0'
          } else if (currentX < threshold * 2) {
            block.style.left = '33.3%'
          } else {
            block.style.left = '66.7%'
          }
        }

        leftImage.style.transform = `translateX(${translateWidth}px)`
        rightImage.style.transform = `translateX(-${translateWidth}px)`
        wrapper.style.display = 'block'
        setTimeout(() => {
          body.style.transform = 'scale(1, 1)'
          leftImage.style.transform = 'translateX(0)'
          rightImage.style.transform = 'translateX(0)'
        }, 100)
      }
    },
    // 初始化文本组件点击
    initTextClick() {
      function bindEvent(uuid, pageId) {
        const text = document.querySelector('[data-uuid="' + uuid + '"] > .text-txt')
        if (!text) {
          setTimeout(() => {
            bindEvent(uuid, pageId)
          }, 800)
        } else {
          text.style.cursor = 'pointer'
          text.addEventListener('click', function(event) {
            console.log(event)
            window.openIframe(pageId, event.x)
          })
        }
      }

      this.$store.state.widgets.forEach(function(widget) {
        if (textContentMapping[widget.title]) {
          const pageId = textContentMapping[widget.title]
          bindEvent(widget.uuid, pageId)
        }
      })
    }
  }
}
