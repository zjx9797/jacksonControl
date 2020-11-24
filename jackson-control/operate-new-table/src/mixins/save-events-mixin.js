const mixin = {
  methods: {
    // 新增父记录
    addParent() {
      const params = {
        eventName: this.editingParentEntry.eventName,
        eventType: this.editingParentEntry.eventType,
        eventConfId: this.editingParentEntry.eventConfId,
        eventDesc: this.editingParentEntry.eventDesc,
        creatorReason: this.editingParentEntry.createReason
      }
      console.log('add parent', params)

      $.ajax({
        url: `${this.prefix}/event/record/strike`,
        type: 'POST',
        data: params,
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        dataType: 'json',
        success: res => {
          if (res.success) {
            this.searchData.page = 1
            this.getTableData()
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.clearInputContent()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 修改父记录
    updateParent(eventRecordId) {
      const params = {
        eventRecordId,
        eventName: this.editingParentEntry.eventName,
        eventType: this.editingParentEntry.eventType,
        eventDesc: this.editingParentEntry.eventDesc,
        creatorReason: this.editingParentEntry.createReason
      }
      console.log('update parent', params)

      $.ajax({
        url: `${this.prefix}/event/record/${eventRecordId}/update`,
        type: 'POST',
        data: params,
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (res.success) {
            this.getTableData()
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.clearInputContent()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 添加子记录
    addChild(eventRecordId) {
      const params = {
        assigneeId: this.editingChildEntry.assigneeId,
        taskName: this.editingChildEntry.taskName,
        taskDesc: this.editingChildEntry.taskDesc,
        planCloseTime: this.editingChildEntry.planTime.getTime(),
        taskReason: this.editingChildEntry.taskReason,
        reviewTime: this.editingChildEntry.reviewTime
          ? this.editingChildEntry.reviewTime.getTime() : undefined,
        eventRecordId
      }
      console.log('add child', params)

      $.ajax({
        url: `${this.prefix}/task/record/insert`,
        type: 'POST',
        data: params,
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        dataType: 'json',
        success: async res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            await this.getTableData()
            this.clearInputContent()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 修改子记录
    updateChild(taskRecordId, isSystem) {
      let params
      if (isSystem) {
        params = {
          executorId: this.editingChildEntry.assigneeId,
          status: this.editingChildEntry.status,
          reviewTime: this.editingChildEntry.reviewTime
            ? this.editingChildEntry.reviewTime.getTime() : undefined,
          taskRecordId
        }
      } else {
        params = {
          executorId: this.editingChildEntry.assigneeId,
          status: this.editingChildEntry.status,
          taskName: this.editingChildEntry.taskName,
          taskDesc: this.editingChildEntry.taskDesc,
          planCloseTime: this.editingChildEntry.planTime.getTime(),
          taskReason: this.editingChildEntry.taskReason,
          reviewTime: this.editingChildEntry.reviewTime
            ? this.editingChildEntry.reviewTime.getTime() : undefined,
          taskRecordId
        }
      }
      console.log('update child', params)

      $.ajax({
        url: `${this.prefix}/task/record/update`,
        type: 'POST',
        data: params,
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (res.success) {
            this.getTableData()
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.clearInputContent()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 获取跟进人列表
    getFollowManOptions(departmentId = '') {
      $.ajax({
        url: `${this.prefix}/user/getAllUser`,
        type: 'POST',
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: { departmentId },
        success: res => {
          if (res.success) {
            this.followManOptions = res.data.map(item => {
              let result = {}
              result.value = item.accId
              result.label = item.accountName
              return result
            })
          }
        }
      })
    },
    // 获取跟进部门列表
    getFollowDepOptions() {
      return $.ajax({
        url: `${this.prefix}/user/getDepartments`,
        type: 'POST',
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (res.success) {
            this.followDepOptions = res.data.map(item => {
              let result = {}
              result.value = item.departmentId
              result.label = item.departmentName
              return result
            })
          }
        }
      })
    },
    // 获取事件类型 options
    getEventTypeOptions() {
      return $.ajax({
        url: `${this.prefix}/event/type/list`,
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (res.success) {
            this.eventTypeList = res.data
          }
        }
      })
    },
  }
}

export default mixin
