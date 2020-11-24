<template>
  <div class="operate-event-type-filter">
    <div class="filter-container">
      <span class="filter-item">
        <label class="filter-item-text">事件ID：</label>
        <el-input
          v-model="inputID"
          placeholder="请输入内容"
          size="mini"
          class="eventid-input"
          :class="borderRadiusClass"
        />
      </span>
      <span class="filter-item">
        <label class="filter-item-text">配置名称：</label>
        <el-input
          v-model="inputName"
          placeholder="请输入内容"
          size="mini"
          class="eventid-input"
          :class="borderRadiusClass"
        />
      </span>
      <span class="filter-item">
        <label class="filter-item-text">创建时间：</label>
        <el-date-picker
          v-model="pickDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          class="updatetime-select"
          :class="borderRadiusClass"
          :default-time="['00:00:00', '23:59:59']"
        />
      </span>
      <span class="filter-item">
        <label class="filter-item-text">跟进部门：</label>
        <el-select
          v-model="followDepValue"
          placeholder="请选择"
          size="mini"
          clearable
          class="followman-select"
          :class="borderRadiusClass"
          @change="followDepChange();"
        >
          <el-option
            v-for="item in followDepOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>
      <span class="filter-item">
        <label class="filter-item-text">跟进人：</label>
        <el-select
          v-model="followManValue"
          placeholder="请选择"
          size="mini"
          clearable
          class="followman-select"
          :class="borderRadiusClass"
        >
          <el-option
            v-for="item in followManOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </span>

      <div class="filter-item-right">
        <el-button
          type="primary"
          round
          size="mini"
          @click="emitCustomFilterParams({inputID,inputName,followManValue,followDepValue,pickDate})"
        >搜索
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import setting from './setting'

export default {
  name: 'operate-event-type-filter',
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
  },
  mounted() {
    this.getFollowDepOptions().then(res => {
      this.getFollowManOptions()
    })
  },
  data() {
    return {
      token: null,
      inputID: '',
      inputName: '',
      followManValue: null,
      followManOptions: [],
      followDepValue: null,
      followDepOptions: [],
      pickDate: null
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
    },
    prefix() {
      if (this.val.config.find(_ => _.key === 'debugSetting').items[0].value) {
        return 'http://jsonctr.dev.datastory.com.cn'
      }
      return this.val.config.find(_ => _.key === 'apiSetting').items[0].value
    }
  },
  methods: {
    // 外面筛选器改变时调用此方法
    initCustomFilterParams(params) {
      // console.log(params)
    },
    // 内部筛选器改变时发射事件
    emitCustomFilterParams(params) {
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

      const setParams = {
        eventConfId: params.inputID,
        eventName: params.inputName,
        executorId: params.followManValue,
        executorDepartment,
        startTime,
        endTime
      }
      this.$emit('emitCustomFilterParams', setParams)
    },
    // 外部数据渲染
    initComponentsData(data) {
      // console.log(data)
    },
    followDepChange() {
      this.getFollowManOptions()
      this.followManValue = ''
    },
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
    }
  },
  setting
}
</script>

<style lang="less">
.operate-event-type-filter {
  height: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #e2e2e2;
  min-width: 1260px;
  position: relative;
  font-size: 14px;

  .filter-container {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);

    .filter-item {
      margin-left: 10px;

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

    .eventid-input {
      width: 120px;
      // max-width: 11.5%;
    }

    .input-round {
      border-radius: 30px;

      input {
        border-radius: 30px;
      }
    }

    // .updatetime-select {
    //   max-width: 25%;
    // }

    .followman-select {
      width: 140px;
      // max-width: 11.5%;
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
