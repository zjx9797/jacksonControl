export default {
  methods: {
    // 是否显示保存和取消
    isSaveButtonShow(item) {
      if (item.id === this.editingChildEntry.id) return true
      if (item.id === this.editingParentEntry.id) return true
      return false
    },
    // 是否显示修改
    isModiButtonShow(item) {
      if (this.isTableEditing) {
        return false
      }

      if (item.isChild && !item.operations.UPDATE_TASK ||
        !item.isChild && !item.operations.UPDATE_EVENT) {
        return false
      }

      const isClosed = item.status == 3
      // 父事件：允许非内置；子事件：允许非关闭
      if (item.isChild) {
        return !isClosed
      } else {
        return !this.isSystemEventType(item.eventType)
      }
    },
    // 是否显示「新增跟进子事件」
    isAddFollowButtonShow(item) {
      if (this.isTableEditing || this.isMinePage) {
        return false
      }

      if (!item.isChild && !item.operations.INSERT_TASK) {
        return false
      }

      // 父事件：允许非内置；子事件：不允许
      if (item.isChild) {
        return false
      } else {
        return !this.isSystemEventType(item.eventType)
      }
    },
    // 是否显示上传
    isUploadShow(item) {
      if (this.isTableEditing) {
        return false
      }

      if (item.isChild && !item.operations.UPLOAD_FILE) {
        return false
      }

      if (!item.isChild) {
        return false
      }
      const isClosed = item.status == 3
      return !isClosed
    },
    // 是否显示下载
    isDownloadShow(item) {
      if (this.isTableEditing) {
        return false
      }
      if (item.isChild && !item.operations.DOWNLOAD_FILE) {
        return false
      }

      if (!item.isChild) {
        return false
      }
      const isClosed = item.status == 3
      return !isClosed
    },
    // 是否显示跟进记录
    isFollowTableShow(item) {
      if (this.isTableEditing) {
        return false
      }

      if (item.isChild && !item.operations.SHOW_EXECUTE_RECORD) {
        return false
      }

      if (!item.isChild) return false
      const isClosed = item.status == 3
      return !isClosed
    },
    // 是否显示新增跟进
    isFollowNewShow(item) {
      if (this.isTableEditing) {
        return false
      }
      if (item.isChild && !item.operations.INSERT_EXECUTE_RECORD) {
        return false
      }

      if (!item.isChild) return false
      const isClosed = item.status == 3
      return !isClosed
    }
  }
}
