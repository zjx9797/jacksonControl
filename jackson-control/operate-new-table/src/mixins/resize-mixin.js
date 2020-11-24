export default {
  data() {
    return {
      isResizing: false,
      startX: 0,
      startWidth: 0,
      eventDescWidth: 220
    }
  },
  computed: {
    leftWrapperWidth() {
      return 130 + 110 + 110 + this.eventDescWidth
    }
  },
  methods: {
    // 开始调整「事件描述」一列的宽度
    startResizing(event) {
      this.isResizing = true
      this.startX = event.pageX
      this.startWidth = this.eventDescWidth
      document.addEventListener('mousemove', this.onResizing)
      document.addEventListener('mouseup', this.endResizing)
    },
    onResizing(event) {
      if (!this.isResizing) {
        return
      }
      this.eventDescWidth = this.startWidth + (event.pageX - this.startX) > 100
        ? this.startWidth + (event.pageX - this.startX)
        : 100
    },
    endResizing() {
      this.isResizing = false
      document.removeEventListener('mousemove', this.onResizing)
      document.removeEventListener('mouseup', this.endResizing)
    }
  }
}