<template>
  <div class="operate-filter">
    <div class="filter-container">
      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-item-text">事件类型：</label>
          <el-select
            v-model="eventType"
            placeholder="请选择"
            size="mini"
            clearable
            style="width: 140px;"
            :class="borderRadiusClass"
          >
            <el-option
              v-for="item in eventTypeOptions"
              :key="item.id"
              :label="item.eventType"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-item-text">事件名称：</label>
          <el-input
            v-model="eventName"
            placeholder="请输入内容"
            size="mini"
            style="width: 140px;"
            :class="borderRadiusClass"
          />
        </div>
        <div class="filter-item">
          <label class="filter-item-text">事件描述：</label>
          <el-input
            v-model="eventDesc"
            placeholder="请输入内容"
            size="mini"
            style="width: 140px;"
            :class="borderRadiusClass"
          />
        </div>
        <div class="filter-item">
          <label class="filter-item-text">状态：</label>
          <el-select
            v-model="status"
            placeholder="请选择"
            size="mini"
            clearable
            style="width: 140px;"
            :class="borderRadiusClass"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="filter-row">
        <div class="filter-item">
          <label class="filter-item-text">跟进部门：</label>
          <el-select
            v-model="followDepValue"
            placeholder="请选择"
            size="mini"
            clearable
            style="width: 140px;"
            :class="borderRadiusClass"
            @change="followDepChange"
          >
            <el-option
              v-for="item in followDepOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-item-text">跟进人：</label>
          <el-select
            v-model="followManValue"
            placeholder="请选择"
            size="mini"
            clearable
            style="width: 140px;"
            :class="borderRadiusClass"
          >
            <el-option
              v-for="item in followManOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="filter-item">
          <label class="filter-item-text">创建时间：</label>
          <el-date-picker
            v-model="pickDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            :class="borderRadiusClass"
            :default-time="['00:00:00', '23:59:59']"
          />
        </div>
        <div class="filter-item-right">
          <el-button
            type="primary"
            round
            size="middle"
            @click="emitCustomFilterParams"
          >
            搜索
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'operate-filter',
  props: ['val'],
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

    let isDebug = false
    this.val.config.forEach(item => {
      if (item.key === 'apiSetting') {
        this.prefix = item.items.find(sign => sign.key === 'apiPrefix').value
      } else if (item.key === 'debugSetting') {
        isDebug = item.items[0].value
      }
    })

    // Debug 模式下写死 prefix 的值
    if (isDebug) {
      this.prefix = 'http://jsonctr.dev.datastory.com.cn'
    }
  },
  mounted() {
    this.getFollowDepOptions().then(res => {
      this.getFollowManOptions()
    })
    this.getEventTypeOptions()
  },
  data() {
    return {
      token: null,
      followManValue: null,
      followManOptions: [],
      followDepValue: null,
      followDepOptions: [],
      eventTypeOptions: [],
      pickDate: null,
      prefix: '',
      eventName: '',
      eventType: '',
      eventDesc: '',
      status: null,
      statusOptions: [{
        label: '全部',
        value: 10086
      }, {
        label: '新建',
        value: 0
      }, {
        label: '完成',
        value: 1
      }, {
        label: '取消',
        value: 2
      }, {
        label: '关闭',
        value: 3
      }, {
        label: '处理中',
        value: 4
      }]
    }
  },
  computed: {
    items() {
      return [].concat(
        ...this.val.config
          .filter(panel => panel.items)
          .map(panel => panel.items)
      )
    },
    borderRadiusClass() {
      let result = ''
      this.items.forEach(item => {
        if (item.key === 'borderRadiusSwitch') {
          if (item.value) result = 'input-round'
        }
      })
      return result
    }
  },
  methods: {
    // 内部筛选器改变时发射事件
    emitCustomFilterParams() {
      const params = {
        followManValue: this.followManValue,
        followDepValue: this.followDepValue,
        pickDate: this.pickDate
      }

      let executorDepartment = ''
      this.followDepOptions.forEach(item => {
        if (item.value === params.followDepValue) {
          executorDepartment = item.label
        }
      })

      let startTime = null
      let endTime = null
      if (params.pickDate) {
        startTime = params.pickDate[0].getTime()
        endTime = params.pickDate[1].getTime()
      }

      // 根据后端查询接口拼接对应的参数
      const setParams = {
        executorId: params.followManValue,
        executorDepartment,
        startTime,
        endTime,
        eventName: this.eventName,
        eventDesc: this.eventDesc,
        eventType: this.eventType,
        status: this.status
      }
      this.$emit('emitCustomFilterParams', setParams)
    },
    // 外部数据渲染
    initComponentsData() {
    },
    followDepChange() {
      this.getFollowManOptions()
      this.followManValue = ''
    },
    // 获取跟进人列表
    getFollowManOptions() {
      $.ajax({
        url: `${this.prefix}/user/getAllUser`,
        type: 'POST',
        dataType: 'json',
        headers: {
          Token: this.token
        },
        // 允许携带证书cookies
        xhrFields: {
          withCredentials: true
        },
        data: {
          departmentId: this.followDepValue
        },
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
        // 允许携带证书cookies
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
    // 获取事件类型列表
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
            this.eventTypeOptions = res.data
          }
        }
      })
    }
  },
  setting: {
    title: '运营事件筛选器',
    config: [{
      name: '数据接口',
      key: 'apiSetting',
      items: [{
        key: 'apiPrefix',
        label: '域名',
        type: 'panel-input',
        value: 'http://10.111.83.243:8085'
      }]
    }, {
      key: 'style',
      name: '样式设置',
      items: [{
        label: '是否开启圆角',
        type: 'panel-switch',
        key: 'borderRadiusSwitch',
        value: true,
        disabled: false
      }]
    }, {
      name: '调试配置(开发用)',
      key: 'debugSetting',
      items: [{
        label: '测试环境调试',
        type: 'panel-switch',
        value: false
      }]
    }]
  }
}
</script>

<style lang="less">
.operate-filter {
  height: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #e2e2e2;
  min-width: 1100px;
  position: relative;
  font-size: 14px;

  .filter-container {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);

    .filter-row {
      margin-bottom: 20px;
    }

    .filter-item {
      display: inline-block;
      min-width: 270px;
      margin-left: 25px;

      label.filter-item-text {
        display: inline-block;
        min-width: 80px;
        text-align: right;
      }

      &:first-child {
        margin-left: 30px;
      }

      .el-input {
        .el-input__inner:focus {
          border-color: #00559f;
          outline: 0;
        }
        .el-select {
          .el-input__inner:focus {
            border-color: #00559f;
            outline: 0;
          }
        }
      }

      .el-range-editor.is-active,
      .el-range-editor.is-active:hover {
        border-color: #00559f;
      }

      .el-date-editor--daterange.el-input__inner,
      .el-date-editor--timerange.el-input {
        width: 220px;
      }
    }

    .filter-item-right {
      float: right;
      padding-right: 20px;
      .el-button--primary {
        color: #fff;
        background-color: #00559f;
        border-color: #00559f;
        width: 80px;
        height: 30px;
        padding-top: 7px;
      }
      .el-button--primary:hover {
        background: #3375b1;
        border-color: #3375b1;
      }
    }

    .input-round {
      border-radius: 30px;
      input {
        border-radius: 30px;
      }
    }
    .followman-select {
      width: 130px;
    }
  }
}

.el-date-table td.end-date span,
.el-date-table td.start-date span {
  background-color: #00559f;
}
.el-date-table td.today span {
  color: #00559f;
}
.el-select-dropdown__item.selected {
  color: #00559f;
}
</style>
