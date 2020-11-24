const mixin = {
  methods: {
    // 打开对话框
    openEventTypeDialog() {
      this.refreshEventTypeRows()
      this.clearEditingEventType()
      this.showEventTypeDialog = true
    },
    refreshEventTypeRows() {
      this.eventTypeRows = this.eventTypeList.map(item => ({
        id: item.id,
        eventType: item.eventType,
        eventTypeDesc: item.eventTypeDesc,
        systemType: item.systemType
      }))
    },
    // 添加事件类型
    addEventType() {
      if (this.editingEventType.id) {
        return
      }

      this.editingEventType.id = 'new'
      this.editingEventType.eventType = ''
      this.eventTypeRows.unshift({
        id: 'new',
        eventType: '',
        eventTypeDesc: '',
        systemType: ''
      })
    },
    // 编辑事件类型
    editEventType(row) {
      this.editingEventType.id = row.id
      this.editingEventType.eventType = row.eventType
      this.editingEventType.eventTypeDesc = row.eventTypeDesc
    },
    // 保存事件类型
    saveEventType(row) {
      // 检查是否填写了事件类型
      if (!this.editingEventType.eventType) {
        this.$message.error('请填写事件类型')
        return
      }

      const params = {
        eventType: this.editingEventType.eventType,
        eventTypeDesc: this.editingEventType.eventTypeDesc
      }

      if (row.id !== 'new') {
        params.id = row.id
      }

      this.eventTypeDialogLoading = true
      $.ajax({
        url: `${this.prefix}/event/type/${params.id ? 'update' : 'insert'}`,
        dataType: 'json',
        type: 'post',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: params,
        success: res => {
          this.eventTypeDialogLoading = false
          if (res.success) {
            this.$message.success('保存成功')
            this.getEventTypeOptions().then(this.refreshEventTypeRows)
            this.clearEditingEventType()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // 取消编辑事件类型
    cancelEventType(row) {
      if (row.id === 'new') {
        this.eventTypeRows.shift()
      }
      this.clearEditingEventType()
    },
    clearEditingEventType() {
      this.editingEventType.id = ''
      this.editingEventType.eventType = ''
      this.editingEventType.eventTypeDesc = ''
    }
  }
}

export default mixin
