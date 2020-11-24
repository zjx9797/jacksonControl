<template>
  <div class="operate-event-type-manage">
    <el-table
      v-loading="loading"
      class="operate-event-type-manage__table"
      :data="tableData"
      size="small"
      height="calc(100% - 40px)"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="50">
      </el-table-column>
      <el-table-column
        prop="corpusKey"
        label="配置类别">
        <template slot-scope="{ row }">
          <div v-if="editingEventType.id === row.id">
            <el-select
              v-model="editingEventType.corpusKey"
              placeholder="请选择配置类别"
              size="mini"
              popper-class="operate-event-type-manage__select-pop"
            >
              <el-option
                v-for="item in corpusKeyMap"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div v-else>
            {{ row.corpusKey | corpusKeyFilter(corpusKeyMap) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ftpFilePath"
        label="FTP文件路径">
        <template slot-scope="{ row }">
          <div v-if="editingEventType.id === row.id">
            <el-input
              v-model="editingEventType.ftpFilePath"
              placeholder="请输入FTP文件路径"
              size="mini"
            />
          </div>
          <div v-else>
            {{ row.ftpFilePath }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="fileName"
        label="文件名">
      </el-table-column>
      <el-table-column
        prop="date"
        label="拉取时间">
        <template slot-scope="{ row }">
          <div v-if="editingEventType.id === row.id">
            <el-time-picker
              v-model="editingEventType.fileCron"
              placeholder="请选择拉取时间"
              size="mini">
            </el-time-picker>
          </div>
          <div v-else>
            {{ row.fileCron }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ftpUsername"
        label="FTP用户名">
        <template slot-scope="{ row }">
          <div v-if="editingEventType.id === row.id">
            <el-input
              v-model="editingEventType.ftpUsername"
              placeholder="请输入FTP用户名"
              size="mini"
            />
          </div>
          <div v-else>
            {{ row.ftpUsername }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="ftpPassword"
        label="FTP密码">
        <template slot-scope="{ row }">
          <div v-if="editingEventType.id === row.id">
            <el-input
              v-model="editingEventType.ftpPassword"
              placeholder="请输入FTP密码"
              size="mini"
            />
          </div>
          <div v-else>
            {{ row.ftpPassword }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button
            v-if="!editingEventType.id"
            type="text"
            size="mini"
            @click="editEventType(scope.row)">
            修改
          </el-button>
          <el-button
            v-if="scope.row.id === editingEventType.id"
            type="text"
            size="mini"
            @click="saveEventType(scope.row)">
            保存
          </el-button>
          <el-button
            v-if="scope.row.id === editingEventType.id"
            type="text"
            size="mini"
            @click="cancelEventType(scope.row)">
            取消
          </el-button>
          <el-button
            type="text"
            @click="runEvent(scope.row)"
            v-if="!editingEventType.id"
            size="mini">
            拉取
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="operate-event-type-manage__pagination">
      <el-pagination
        small
        popper-class="operate-event-type-manage__select-pop"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pagination.page"
        :page-sizes="[20, 30, 50, 100]"
        :page-size="pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import setting from './setting'
export default {
  name: 'operate-event-type-manage',
  props: ['val'],
  data() {
    return {
      loading: false,
      token: null,
      pagination: {
        page: 1,
        size: 20,
        total: 0
      },
      tableData: [],
      editingEventType: {
        id: '',
        corpusKey: '',
        ftpUsername: '',
        ftpPassword: '',
        fileCron: '',
        ftpFilePath: ''
      },
      corpusKeyMap: [{
        value: 'GI_MOVEMENT_FILE',
        label: 'GI配置'
      }, {
        value: 'GR_MOVEMENT_FILE',
        label: 'GR配置'
      }, {
        value: 'ORDER_FULFILLMENT',
        label: 'order_fulfillment配置'
      }]
    }
  },
  computed: {
    isDebug() {
      return this.val.config.find(_ => _.key === 'debugSetting').items[0].value
    },
    // 获取域名
    prefix() {
      if (this.isDebug) {
        return 'http://jsonctr.dev.datastory.com.cn'
      }
      return this.val.config.find(_ => _.key === 'apiSetting').items[0].value
    }
  },
  filters: {
    corpusKeyFilter(val, option) {
      const str = option.find(item => item.value === val)
      return str.label || val
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
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      this.loading = true
      $.ajax({
        url: `${this.prefix}/ftp/list`,
        dataType: 'json',
        headers: {
          Token: this.token
        },
        data: { 
          page: this.pagination.page,
          size: this.pagination.size
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (res.success) {
            this.loading = false
            this.tableData = res.data.list
            this.pagination.total = res.data.count
            this.tableData = res.data.list.map(item => {
              item.fileName = this.subStr(item.ftpFilePath)
              item.fileCron = this.cornChangeTime(item.filePullCron)
              return item
            })
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    handleSizeChange(val) {
      this.pagination.size = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.pagination.page = val
      this.getTableData()
      this.cancelEventType()
    },
    runEvent(row) {
      $.ajax({
        url: `${this.prefix}/ftp/job/strike`,
        dataType: 'json',
        type: 'post',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: {
          key: row.corpusKey
        },
        success: res => {
          if (res.success) {
            this.$message.success('拉取成功')
            this.getTableData()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // 截取ftp路径最后一个/之后的文字
    subStr(str) {
      const index = str .lastIndexOf('\/')
      return str.substring(index + 1, str.length)
    },
    // 转化corn为时:分:秒
    cornChangeTime(str) {
      if (!str) {
        return null
      }
      const arr = str.split(' ').slice(0, 3).map(item => item.padStart(2, '0'))
      arr.reverse()
      return arr.join(':')
    },
    // 编辑事件类型
    editEventType(row) {
      this.editingEventType.id = row.id
      this.editingEventType.corpusKey = row.corpusKey
      this.editingEventType.ftpUsername = row.ftpUsername
      this.editingEventType.ftpPassword = row.ftpPassword
      const arr = row.fileCron.split(':')
      this.editingEventType.fileCron = new Date(2020, 3, 3, arr[0], arr[1], arr[2])
      this.editingEventType.ftpFilePath = row.ftpFilePath
    },
    saveEventType() {
      const params = {
        id: this.editingEventType.id,
        corpusKey: this.editingEventType.corpusKey,
        ftpUsername: this.editingEventType.ftpUsername,
        ftpPassword: this.editingEventType.ftpPassword,
        ftpFilePath: this.editingEventType.ftpFilePath,
        filePullCron: this.editingEventType.fileCron ? this.returnCronPre(this.editingEventType.fileCron) : ''
      }
      $.ajax({
        url: `${this.prefix}/ftp/update`,
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
          if (res.success) {
            this.$message.success('保存成功')
            this.getTableData()
            this.cancelEventType()
          } else {
            this.$message.error(res.message)
          }
        }
      })
    },
    // 返回cron表达式
    returnCronPre(time) {
      const d = new Date(this.editingEventType.fileCron)
      let arr = [d.getSeconds(), d.getMinutes(), d.getHours(), '*', '*', '? ']
      return arr.join(' ')
    },
    cancelEventType() {
      this.editingEventType.id = ''
      this.editingEventType.corpusKey = ''
      this.editingEventType.ftpUsername = ''
      this.editingEventType.ftpPassword = ''
      this.editingEventType.fileCron = ''
      this.editingEventType.ftpFilePath = ''
    },
    // 外面筛选器改变时调用此方法
    /* eslint-disable no-unused-vars */
    initCustomFilterParams(params) {
      console.log(params)
    },
    // 内部筛选器改变时发射事件
    emitCustomFilterParams(params) {
      this.$emit('emitCustomFilterParams', params)
    },
    // 外部数据渲染
    /* eslint-disable no-unused-vars */
    initComponentsData(data) {
      console.log(data)
    }
  },
  setting
}

</script>

<style lang="less">
  .operate-event-type-manage {
    height: 100%;
    box-sizing: border-box;
    &__table {
      border: 1px solid #ebeef5;
      border-bottom: none;
      .el-date-editor.el-input, .el-date-editor.el-input__inner {
        width: 100%;
      }
      button.el-button--text {
        color: #00559f;
      }
      table.el-table__header > thead > tr {
        & > th {
          background-color: #00559f;
        }
        color: #fff;
      }
      .el-input .el-input__inner, .el-select .el-input__inner {
        border-radius: 30px;
      }
      .el-input .el-input__inner:focus, .el-select .el-input__inner:focus {
        border-color: #00559f;
        outline: 0;
      }
    }
    &__pagination {
      text-align: right;
      padding-top: 8px;
      .el-pagination .el-select .el-input .el-input__inner {
        height: 22px;
      }
      .el-pagination .el-select .el-input .el-input__icon {
        line-height: 22px;
      }
      .el-pagination .el-input .el-input__inner:focus, .el-pagination .el-select .el-input__inner:focus {
        border-color: #00559f;
        outline: 0;
      }
      .el-pager li.active, .el-pager li:hover, .el-pagination button:hover {
        color: #00559f;
      }
      .el-pagination button:disabled:hover {
        color: #c0c4cc; 
      }
      .el-pagination__sizes .el-input .el-input__inner:hover {
        border-color: #00559f;
      }
    }
    .el-select .el-input.is-focus .el-input__inner {
      border-color: #00559f;
    }
    &__select-pop {
      .el-select-dropdown__item.selected {
        color: #00559f;
      }
    }
  }
</style>
