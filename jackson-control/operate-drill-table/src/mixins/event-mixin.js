export default {
  data() {
    return {
      status: 0,
      token: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      eventLoading: false,
      eventTableHead: [
        { name: '序号' },
        { name: '事件名称' },
        { name: '父事件描述' },
        { name: '子事件描述' },
        { name: '创建人' },
        { name: '状态' },
        { name: '跟进部门' },
        { name: '跟进人' },
        { name: '创建时间' },
        { name: '回顾时间' },
        { name: '预计关闭时间' }
      ],
      eventTableBody: [],
      followLoading: false,
      followTableHead: [{
        name: '序号',
        width: 50
      }, {
        name: '跟进人',
        width: 85
      }, {
        name: '跟进描述'
      }, {
        name: '创建时间',
        width: 85
      }],
      followTableBody: [],
      fileLoading: false,
      fileTableHead: [{
        name: '序号',
        width: 50
      }, {
        name: '创建人',
        width: 85
      }, {
        name: '文件名'
      }, {
        name: '创建日期',
        width: 85
      }],
      fileTableBody: []
    }
  },
  computed: {
    eventSlice() {
      return this.eventTableBody.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      )
    },
    eventNoData() {
      return !this.eventLoading && this.eventTableBody.length === 0
    },
    followNoData() {
      return !this.followLoading && this.followTableBody.length === 0
    },
    fileNoData() {
      return !this.fileLoading && this.fileTableBody.length === 0
    }
  },
  created() {
    if (document.cookie) {
      const cookieObj = document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=')
        if (name === 'uc_access_token' && prev.uc_access_token) {
          // uc_access_token 多于1个 防止覆盖 合并字符串
          prev.uc_access_token = prev.uc_access_token + ',' + value
        } else {
          prev[name] = value
        }
        return prev
      }, {})

      if (cookieObj.uc_access_token) {
        this.token = cookieObj.uc_access_token
      }
    }
  },
  async mounted() {
    await this.searchEventList()
  },
  methods: {
    // 搜索事件列表
    async searchEventList() {
      this.eventLoading = true
      const { success, data, message } = await this.ajax({
        url: `${this.prefix}/event/record/list/unFinishedRecord`,
        data: {
          finished: this.status === 0 ? false : true
        }
      })
      this.eventLoading = false
      if (success) {
        console.log('获取事件列表', data)
        this.eventTableBody = data
        this.total = this.eventTableBody.length
      } else {
        this.$message.error(message)
      }
    },
    async searchFollowList(taskRecordId) {
      this.followLoading = true
      const { success, data } = await this.ajax({
        url: `${this.prefix}/task/execute/${taskRecordId}/list`
      })
      this.followLoading = false
      if (success) {
        console.log('获取跟进列表', data)
        this.followTableBody = data
      }
    },
    async searchFileList(taskRecordId) {
      this.fileLoading = true
      const { success, data } = await this.ajax({
        url: `${this.prefix}/file/list`,
        data: { taskRecordId }
      })
      this.fileLoading = false
      if (success) {
        console.log('获取下载文件列表', data)
        this.fileTableBody = data
      }
    },
    ajax(options) {
      return new Promise((resolve) => {
        const newParams = Object.assign({}, {
          dataType: 'json',
          type: 'get',
          headers: {
            Token: this.token
          },
          xhrFields: {
            withCredentials: true
          },
          success: res => {
            resolve(res)
          }
        }, options)

        $.ajax(newParams)
      })
    }
  }
}