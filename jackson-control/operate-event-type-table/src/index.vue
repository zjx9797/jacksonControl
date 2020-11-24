<template>
  <div class="operate-event-type-table" v-loading="loading">
    <div class="task-button">
      <el-button
        type="success"
        round
        icon="el-icon-plus"
        size="small"
        @click="addNewParent"
      >
        新增事件
      </el-button>
      <el-button
        type="success"
        round
        icon="el-icon-tickets"
        size="small"
        @click="openEventTypeDialog"
      >
        事件类型
      </el-button>
    </div>
    <div class="task-container">
      <div class="table-title">
        <span class="dot"></span>
        <span>事件列表</span>
      </div>
      <div class="table-container">
        <div class="el-table new-table">
          <div class="new-table__header-wrapper">
            <div class="table-header-main" ref="scrollHeadDiv">
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width: 100%;"
                ref="scrollHead"
              >
                <colgroup>
                  <col
                    v-for="(column, index) in headerArray"
                    :key="index+'hmCol'"
                    :width="column.width"
                  />
                </colgroup>
                <thead>
                <tr>
                  <th
                    v-for="(column, index) in headerArray"
                    :key="index+'hmTr'"
                  >
                    {{ column.title || '' }}
                  </th>
                </tr>
                </thead>
              </table>
            </div>
            <div
              :class="{'table-fixed-left-scroll': hasLeft}"
              class="table-header-left table-fixed-left"
            >
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col
                    v-for="(column, index) in headerArray"
                    :key="index+'hlCol'"
                    :width="column.width"
                    :class="{'tdHidden': column.fixed!='left'}"
                  />
                </colgroup>
                <thead>
                <tr>
                  <th
                    v-for="(column, index) in headerArray"
                    :key="index+'hlTr'"
                    :class="{'tdHidden': column.fixed!='left'}"
                  >
                    <span v-if="column.title === '事件ID'" class="expand-icon" @click="isShowAllChild = !isShowAllChild">
                      <div
                        class="expand-icon-box expand-icon--expanded"
                      >
                        <img
                          class="icon-expand-minus"
                          src="../src/assets/imgs/icon-expand-minus-th.svg"
                          v-if="isShowAllChild"
                        />
                        <img
                          class="icon-expand-plus"
                          src="../src/assets/imgs/icon-expand-plus-th.svg"
                          v-else
                        />
                      </div>
                    </span>
                    {{ column.title || '' }}
                  </th>
                </tr>
                </thead>
              </table>
            </div>
            <div
              :class="{'table-fixed-right-scroll': hasRight}"
              class="table-header-right table-fixed-right"
            >
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col width="190" />
                </colgroup>
                <thead>
                <tr>
                  <th>操作</th>
                </tr>
                </thead>
              </table>
            </div>
          </div>
          <div
            class="new-table__body-main-wrapper"
            ref="scrollBodyWrapperDiv"
            @scroll="debounce(handleBodyScroll, 50)()"
          >
            <div class="table-body-main">
              <table
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="width: 100%;"
                ref="tableContent"
              >
                <colgroup>
                  <col
                    v-for="(column, index) in headerArray"
                    :key="index+'bmCol'"
                    :width="column.width"
                  />
                </colgroup>
                <tbody>
                <tr
                  v-for="(entry,index) in scrollTableData"
                  :key="index+'bmTr'"
                  v-show="!entry.isHide"
                  :class="{hasBackground:entry.isChild}"
                >
                  <td></td>
                  <td></td>
                  <td>
                    <span v-if="!entry.isNew && modiingId !== entry.id">
                      {{ mapEventTypeData(entry.eventType) }}
                    </span>
                    <el-select
                      v-else-if="!entry.isChild"
                      v-model="entryContent.eventType"
                      size="mini"
                      clearable
                    >
                      <el-option
                        v-for="item in eventTypeList"
                        :key="item.id"
                        :label="item.eventType"
                        :value="item.id"
                      />
                    </el-select>
                  </td>
                  <td>
                    <el-select
                      v-if="!entry.isChild && (modiingId === entry.id || entry.isNew)"
                      v-model="entryContent.eventCreatorId"
                      size="mini"
                      filterable
                      clearable
                    >
                      <el-option
                        v-for="item in followManOptions"
                        :key="item.value+item.label"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                    <span v-else>
                      {{ entry.eventCreatorName }}
                    </span>
                  </td>
                  <td>
                    <span v-if="!entry.isNew&&modiingId!==entry.id" class="text-overflow"
                          :title="entry.taskOrEvenetDesc">{{entry.taskOrEvenetDesc}}</span>
                    <el-input
                      v-else
                      v-model="entryContent.inputDesc"
                      size="mini"
                      placeholder="请输入"
                    />
                  </td>
                  <td>
                    <span v-if="!entry.isNew && modiingId !== entry.id">
                      {{ entry.assigneeDepartment }}
                    </span>
                    <el-select
                      v-else-if="entry.isChild"
                      v-model="assigneeDepartmentId"
                      size="mini"
                      @change="onDepartmentChange"
                    >
                      <el-option
                        v-for="item in followDepOptions"
                        :key="item.value + item.label"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </td>
                  <td>
                    <span v-if="!entry.isNew && modiingId !== entry.id">
                      {{ entry.assigneeName }}
                    </span>
                    <el-select
                      v-model="entryContent.assigneeId"
                      size="mini"
                      filterable
                      clearable
                      v-else-if="entry.isChild"
                    >
                      <el-option
                        v-for="item in followManOptions"
                        :key="item.value+item.label"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </td>
                  <td>
                    <span>{{ entry.createTime | formatDate }}</span>
                  </td>
                  <td>
                    <span v-if="!entry.isNew">
                      {{ entry.executionDay }}
                      <span v-if="entry.executionDay">天</span>
                    </span>
                    <el-input-number
                      v-else-if="entry.isChild"
                      v-model="entryContent.executionDay"
                      size="mini"
                      placeholder="请输入"
                      :min="1"
                      :max="1000"
                    />
                  </td>

                  <td>
                    <span v-if="!entry.isNew&&modiingId!==entry.id">{{entry.notifyConfig}}</span>
                    <el-input
                      v-else-if="entry.isChild"
                      v-model="entryContent.notifyConfig"
                      size="mini"
                      placeholder="请输入"
                    />
                  </td>
                  <td>
                    <span v-if="!entry.isNew">
                      {{ entry.eventRuleExpr }}
                    </span>
                    <el-select
                      v-else-if="entry.isParent"
                      v-model="entryContent.eventRuleExpr"
                      size="mini"
                      clearable
                    >
                      <el-option
                        v-for="item in ruleMapArray"
                        :key="item.ruleId+item.ruleName"
                        :label="item.ruleName"
                        :value="item.ruleId"
                      />
                    </el-select>
                  </td>
                  <td>
                    <span></span>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            :class="{
              'new-table__body-left-wrapper': true,
              'table-fixed-left': true,
              'table-fixed-left-scroll': hasLeft}"
            ref="scrollBodyLeftWrapperDiv"
          >
            <div class="table-body-left">
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col :width="headerArray[0].width" />
                  <col :width="headerArray[1].width" />
                </colgroup>
                <tbody>
                <tr
                  v-for="(entry, index) in scrollTableData"
                  :key="index+'blTr'"
                  v-show="!entry.isHide"
                  :class="{hasBackground:entry.isChild}"
                >
                  <td>
                      <span class="expand-icon">
                        <div
                          v-if="entry.isParent&&!entry.isNew"
                          :class="{'expand-icon-box':true,'expand-icon--expanded':entry.expand}"
                          @click="handleExpand(entry.id)"
                        >
                          <!-- <i class="el-icon-arrow-right"></i> -->
                          <img
                            class="icon-expand-minus"
                            src="../src/assets/imgs/icon-expand-minus.svg"
                            v-if="entry.expand"
                          />
                          <img
                            class="icon-expand-plus"
                            src="../src/assets/imgs/icon-expand-plus.svg"
                            v-else
                          />
                        </div>
                      </span>

                    <span v-if="entry.isChild" class="child-indent">
                        <img class="icon-document" src="../src/assets/imgs/icon-document.png" />
                      </span>
                    <span v-else class="parent-indent">
                        <img class="icon-folder" src="../src/assets/imgs/icon-folder.svg" />
                      </span>
                    <span class="showId">{{entry.showId}}</span>
                  </td>
                  <td>
                    <span v-if="!entry.isNew&&modiingId!==entry.id" class="text-overflow" :title="entry.eventName">{{entry.eventName}}</span>
                    <el-input
                      v-else
                      v-model="entryContent.inputName"
                      size="mini"
                      placeholder="请输入"
                    />
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            :class="{
              'new-table__body-right-wrapper': true,
              'table-fixed-right': true,
              'table-fixed-right-scroll': hasRight}"
            ref="scrollBodyRightWrapperDiv"
          >
            <div class="table-body-right">
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col
                    v-for="(column, index) in headerArray.concat().reverse()"
                    :key="index+'brCol'"
                    :class="{'tdHidden': column.fixed!='right'}"
                    :width="column.width"
                  />
                </colgroup>
                <tbody>
                <tr
                  v-for="(entry,index) in scrollTableData"
                  :key="index+'brTr'"
                  v-show="!entry.isHide"
                  :class="{hasBackground:entry.isChild}"
                >
                  <td
                    v-for="(column, index2) in headerArray.concat().reverse()"
                    :key="index2+'brTd'"
                  >
                    <template v-if="column.fixed==='right'">
                      <span v-if="entry[column.key]">
                        {{ entry[column.key] }}
                      </span>
                      <span v-else>
                          <el-button
                            v-if="isSaveButtonShow(entry)"
                            class="save-button"
                            type="text"
                            size="mini"
                            @click="handleAdd(entry)"
                          >
                            保存
                          </el-button>
                          <el-button
                            v-if="isSaveButtonShow(entry)"
                            class="cancel-button"
                            type="text"
                            size="mini"
                            @click="cancelAdd"
                          >
                            取消
                          </el-button>
                          <el-button
                            v-if="isModiButtonShow(entry)"
                            type="text"
                            size="mini"
                            :disabled="isTableEditing"
                            @click="handleModi(entry)"
                          >
                            <img src="../src/assets/imgs/icon-modify.svg" class="icon-modify" />
                            修改
                          </el-button>
                          <el-button
                            v-if="isAddChildButtonShow(entry)"
                            type="text"
                            size="mini"
                            :disabled="isTableEditing"
                            @click="addNewChild(entry.id)"
                          >
                            <img src="../src/assets/imgs/icon-add-child.svg" class="add-child" />
                            新增子事件
                          </el-button>
                        </span>
                    </template>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="table-page">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="totalSize"
          :current-page="searchData.page"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </div>

    <el-dialog
      title="事件类型管理"
      :visible.sync="showEventTypeDialog"
      width="900px"
      custom-class="operate-event-type-table__event-type"
      :close-on-click-modal="false"
    >
      <div class="operate-event-type-table__event-type-btns">
        <el-button icon="el-icon-plus" type="primary" size="small" @click="addEventType">
          新增
        </el-button>
      </div>
      <div class="operate-event-type-table__event-type-table" v-loading="eventTypeDialogLoading">
        <el-table
          :data="eventTypeRows"
          size="small"
          style="width: 100%"
          max-height="300"
          height="300"
        >
          <el-table-column prop="id" label="ID" width="100" />
          <el-table-column prop="eventType" label="事件类型" width="180">
            <template slot-scope="{ row }">
              <div v-if="editingEventType.id === row.id">
                <el-input
                  v-model="editingEventType.eventType"
                  placeholder="请输入"
                  size="mini"
                />
              </div>
              <div v-else>
                {{ row.eventType }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="eventTypeDesc" label="事件类型描述">
            <template slot-scope="{ row }">
              <div v-if="editingEventType.id === row.id">
                <el-input
                  v-model="editingEventType.eventTypeDesc"
                  placeholder="请输入"
                  size="mini"
                />
              </div>
              <div v-else>
                {{ row.eventTypeDesc }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="systemType" label="是否内置类型" width="120">
            <template slot-scope="{ row }">
              {{ row.systemType === 'SYSTEM' ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.systemType !== 'SYSTEM' && !editingEventType.id"
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click="editEventType(scope.row)"
              >
                修改
              </el-button>
              <el-button
                v-if="scope.row.id === editingEventType.id"
                type="text"
                size="mini"
                icon="el-icon-check"
                @click="saveEventType(scope.row)"
              >
                保存
              </el-button>
              <el-button
                v-if="scope.row.id === editingEventType.id"
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click="cancelEventType(scope.row)"
              >
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import setting from './setting'
import eventTypeMixin from './eventTypeMixin'

export default {
  name: 'operate-event-type-table',
  props: ['val'],
  mixins: [eventTypeMixin],
  data() {
    return {
      isShowAllChild: false,
      loading: false,
      token: null,
      ruleMapArray: [],
      assigneeDepartmentId: '',

      // 新增/修改事件输入的内容
      entryContent: {
        inputName: '',
        eventType: '',
        eventRuleExpr: '',
        status: 0,
        inputDesc: '',
        assigneeId: '',
        executionDay: '',
        notifyConfig: '',
        eventCreatorId: ''
      },

      followManOptions: [],
      hasLeft: false,
      hasRight: true,
      scrollValue: 0,
      headerArray: [
        {
          title: '事件ID',
          key: 'id',
          width: 130,
          fixed: 'left'
        },
        {
          title: '配置名称',
          key: 'eventName',
          width: 130,
          fixed: 'left'
        },
        {
          title: '事件类型',
          key: 'eventType',
          width: 180,
        },
        {
          title: '父级/子级事件创建人',
          key: 'creatorName',
          width: 160
        },
        {
          title: '任务描述',
          key: 'eventDescription',
          width: 250
        },
        {
          title: '跟进人部门',
          key: 'executorDepartment',
          width: 150
        },
        {
          title: '任务跟进人',
          key: 'executorName',
          width: 150
        },
        {
          title: '创建时间',
          key: 'createTime',
          width: 150
        },
        {
          title: '计划处理天数',
          key: 'executionDay',
          width: 150
        },
        {
          title: '通知配置',
          key: 'notifyConfig',
          width: 200
        },
        {
          title: '关联规则',
          key: 'eventRuleExpr',
          width: 250
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 200
        }
      ],
      scrollTableData: [],
      isTableEditing: false,
      newingId: null,
      modiingId: null,
      totalSize: 0,
      searchData: {
        page: 1,
        size: 10,
        eventConfId: '',
        eventName: '',
        assigneeId: '',
        assigneeDepartment: '',
        startTime: '',
        endTime: ''
      },
      eventTypeList: [],
      eventTypeRows: [],
      showEventTypeDialog: false,
      eventTypeDialogLoading: false,
      editingEventType: {
        id: '',
        eventType: '',
        eventTypeDesc: ''
      }
    }
  },
  computed: {
    isDebug() {
      return this.val.config.find(_ => _.key === 'debugSetting').items[0].value
    },
    prefix() {
      if (this.isDebug) {
        return 'http://jsonctr.dev.datastory.com.cn'
      }
      return this.val.config.find(_ => _.key === 'apiSetting').items[0].value
    }
  },
  watch: {
    isShowAllChild() {
      this.scrollTableData.forEach((element, index) => {
        element.expand = this.isShowAllChild
        if (element.isChild) {
          element.isHide = !this.isShowAllChild
        }
      })
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        const date = new Date(value)
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hour = date.getHours().toString().padStart(2, '0')
        const min = date.getMinutes().toString().padStart(2, '0')
        return `${year}-${month}-${day} ${hour}:${min}`
      }
      return value
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
    this.getRuleMap().then(this.getTableData)
    this.getEventTypeOptions()
    this.getFollowManOptions()
    this.getFollowDepOptions()
    this.setTableShadow()
    window.addEventListener('resize', this.setTableShadow, false)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableShadow, false)
  },
  methods: {
    mapEventTypeData(value) {
      const d = this.eventTypeList.find(item => Number(item.id) === Number(value))
      const str = d ? d.eventType : ''
      return str
    },
    getFollowManOptions(departmentId = '') {
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
    currentChange(currentPage) {
      this.resetModiingTr()
      this.searchData.page = currentPage
      this.getTableData()
    },
    // 外面筛选器改变时调用此方法
    initCustomFilterParams(params) {
      const filterData = params.customFilter
      if (filterData) {
        this.searchData.eventConfId = filterData.eventConfId
        this.searchData.eventName = filterData.eventName
        this.searchData.assigneeId = filterData.executorId
        this.searchData.assigneeDepartment = filterData.executorDepartment
        this.searchData.startTime = filterData.startTime
        this.searchData.endTime = filterData.endTime
        this.getTableData()
      }
    },
    getRuleMap() {
      this.loading = true
      return $.ajax({
        url: `${this.prefix}/event/rule/queryAll`,
        dataType: 'json',
        type: 'get',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (res.success) {
            this.ruleMapArray = res.data || []
          }
        }
      })
    },
    getTableData() {
      this.loading = true
      return $.ajax({
        url: `${this.prefix}/event/list`,
        dataType: 'json',
        type: 'get',
        data: this.searchData,
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (!res.data || !res.data.list) {
            this.scrollTableData = []
            this.loading = false
            return
          }
          const resArray = res.data.list.reduce((accumulator, currentValue) => {
            let parentItem = {}
            let childrenArray = []
            parentItem.id = currentValue.eventConfId
            parentItem.showId = currentValue.eventConfId
            parentItem.eventType = currentValue.eventType
            parentItem.eventName = currentValue.eventName
            parentItem.creatorName = currentValue.creatorName
            parentItem.taskOrEvenetDesc = currentValue.eventDesc
            parentItem.createTime = currentValue.createTime
            parentItem.eventCreatorName = currentValue.eventCreatorName
            parentItem.eventCreatorId = currentValue.eventCreatorId

            // console.log("object", currentValue.eventRuleExprEntity);
            const ruleObj = currentValue.eventRuleExprEntity
            if (ruleObj && ruleObj.ruleIds && ruleObj.ruleIds.length > 0) {
              // 取关联规则JSON ruleIds 第一个值来获取描述
              const oneRuleId = ruleObj.ruleIds[0]
              const ruleDescObj = this.ruleMapArray.find(
                item => item.ruleId == oneRuleId
              )
              parentItem.eventRuleExpr = ruleDescObj.ruleDesc
            } else {
              parentItem.eventRuleExpr = null
            }

            parentItem.notifyConfig = currentValue.notifyConfig
            parentItem.expand = false

            if (currentValue.eventTaskList.length > 0) {
              parentItem.isParent = true
              childrenArray = currentValue.eventTaskList.map(item => {
                let childItem = {}
                childItem.id = item.taskConfId + 'child'
                childItem.showId = item.taskConfId
                childItem.eventName = item.taskName //子任务的任务名/父任务的事件名
                childItem.assigneeId = item.assigneeId
                childItem.taskOrEvenetDesc = item.taskDesc
                childItem.assigneeName = item.assigneeName
                childItem.assigneeDepartment = item.assigneeDepartment
                childItem.assigneeDepartmentId = item.assigneeDepartmentId
                childItem.notifyConfig = item.notifyConfig
                childItem.createTime = new Date(item.createTime)
                childItem.executionDay = item.executionDay
                childItem.parentId = item.eventConfId
                childItem.eventCreatorName = item.eventCreatorName
                childItem.isChild = true
                childItem.isHide = true
                return childItem
              })
            } else {
              parentItem.isParent = false
            }
            accumulator.push(parentItem)
            accumulator = accumulator.concat(childrenArray)
            return accumulator
          }, [])
          this.scrollTableData = resArray
          this.totalSize = res.data.count
          this.loading = false
        }
      })
    },
    handleBodyScroll() {
      this.scrollTopValue = this.$refs.scrollBodyWrapperDiv.scrollTop
      this.scrollLeftValue = this.$refs.scrollBodyWrapperDiv.scrollLeft

      this.hasRight = this.scrollLeftValue - this.leftScroll < 0
      this.hasLeft = this.scrollLeftValue > 0

      this.$refs.scrollHeadDiv.scrollLeft = this.scrollLeftValue
      this.$refs.scrollBodyLeftWrapperDiv.scrollTop = this.scrollTopValue
      this.$refs.scrollBodyRightWrapperDiv.scrollTop = this.scrollTopValue
    },
    setTableShadow() {
      this.leftScroll =
        this.$refs.tableContent.clientWidth -
        this.$refs.scrollBodyWrapperDiv.clientWidth
      this.handleBodyScroll()
    },
    handleAdd(entry) {
      if (entry.isNew && !entry.isChild) {
        // 新增父任务
        this.addNewParentRequest(entry)
      } else if (entry.isNew && entry.isChild) {
        // 新增子任务
        this.addNewChildRequest(entry)
      } else if (entry.id === this.modiingId && !entry.isChild) {
        // 修改父任务
        this.modiParentRequest(entry)
      } else if (entry.id === this.modiingId && entry.isChild) {
        // 修改子任务
        this.modiChildRequest(entry)
      }
    },
    addNewParentVerifi() {
      if (!this.entryContent.inputName) {
        this.$message.error('请填写配置名称')
        return
      } else if (!this.entryContent.inputDesc) {
        this.$message.error('请填写任务描述')
        return
      } else {
        return true
      }
    },
    addNewParentRequest(entry) {
      if (!this.addNewParentVerifi()) {
        return
      }

      let eventRuleExpr = null
      if (this.entryContent.eventRuleExpr) {
        const selectRuleObj = this.ruleMapArray.find(
          item => item.ruleId === this.entryContent.eventRuleExpr
        )
        if (selectRuleObj) {
          eventRuleExpr = `{ruleExpr:${selectRuleObj.ruleId},dynamicParam:null,ruleIds:[${selectRuleObj.ruleId}]}`
        }
      }
      $.ajax({
        url: `${this.prefix}/event/insert`,
        type: 'POST',
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: {
          eventName: this.entryContent.inputName,
          eventType: this.entryContent.eventType,
          eventDesc: this.entryContent.inputDesc,
          status: this.entryContent.status,
          eventRuleExpr,
          eventCreatorId: this.entryContent.eventCreatorId
        },
        success: res => {
          if (res.success) {
            this.searchData.page = 1
            this.getTableData()
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.resetModiingTr()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    addNewChildVerifi() {
      if (!this.entryContent.inputName) {
        this.$message.error('请填写配置名称')
        return
      } else if (!this.entryContent.inputDesc) {
        this.$message.error('请填写任务描述')
        return
      } else if (!this.entryContent.assigneeId) {
        this.$message.error('请选择跟进人')
        return
      } else if (!this.entryContent.executionDay) {
        this.$message.error('请填写计划处理时间')
        return
      } else {
        return true
      }
    },
    addNewChildRequest(entry) {
      if (!this.addNewChildVerifi()) {
        return
      }
      $.ajax({
        url: `${this.prefix}/task/${entry.parentId}/insert`,
        type: 'POST',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: {
          taskName: this.entryContent.inputName,
          taskDesc: this.entryContent.inputDesc,
          assigneeId: this.entryContent.assigneeId,
          executionDay: this.entryContent.executionDay,
          // notifyConfig: this.entryContent.notifyConfig,
          notifyConfig: 'EMAIL',
          status: this.entryContent.status
        },
        success: res => {
          if (res.success) {
            this.getTableData()
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.resetModiingTr()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    modiParentVerifi() {
      if (!this.entryContent.inputName) {
        this.$message.error('请填写配置名称')
        return
      } else if (!this.entryContent.inputDesc) {
        this.$message.error('请填写任务描述')
        return
      } else {
        return true
      }
    },
    modiParentRequest(entry) {
      if (!this.modiParentVerifi()) {
        return
      }

      $.ajax({
        url: `${this.prefix}/event/${entry.id}/update`,
        type: 'POST',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: {
          eventName: this.entryContent.inputName,
          eventDesc: this.entryContent.inputDesc,
          eventType: this.entryContent.eventType,
          status: this.entryContent.status,
          eventCreatorId: this.entryContent.eventCreatorId
        },
        success: res => {
          if (res.success) {
            this.getTableData()
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.resetModiingTr()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    modiChildVerifi() {
      if (!this.entryContent.inputName) {
        this.$message.error('请填写配置名称')
        return
      } else if (!this.entryContent.inputDesc) {
        this.$message.error('请填写任务描述')
        return
      } else if (!this.entryContent.assigneeId) {
        this.$message.error('请选择跟进人')
        return
      } else {
        return true
      }
    },
    modiChildRequest(entry) {
      if (!this.modiChildVerifi()) {
        return
      }
      $.ajax({
        url: `${this.prefix}/task/${entry.showId}/update`,
        type: 'POST',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: {
          taskName: this.entryContent.inputName,
          taskDesc: this.entryContent.inputDesc,
          notifyConfig: 'EMAIL',
          assigneeId: this.entryContent.assigneeId,
          status: this.entryContent.status
        },
        success: res => {
          if (res.success) {
            this.getTableData()
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.resetModiingTr()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    resetModiingTr() {
      this.modiingId = ''
      this.clearInputContent()
      this.isTableEditing = false
    },
    clearInputContent() {
      this.entryContent = {
        inputName: '',
        eventType: '',
        eventRuleExpr: '',
        status: 0,
        inputDesc: '',
        assigneeId: '',
        executionDay: '',
        notifyConfig: '',
        eventCreatorId: ''
      }
    },
    debounce(fn, delay) {
      delay = delay || 0
      let timerId

      return function () {
        if (timerId) {
          clearTimeout(timerId)

          timerId = null
        }
        timerId = setTimeout(function () {
          fn()
        }, delay)
      }
    },
    handleExpand(id) {
      this.scrollTableData.forEach(element => {
        if (element.id === id) {
          element.expand = !element.expand
        }
        if (element.parentId === id) {
          element.isHide = !element.isHide
        }
      })
    },
    addNewParent() {
      if (this.isTableEditing) return

      if (this.searchData.page === 1) {
        this.insertNewParent()
      } else {
        this.searchData.page = 1
        this.getTableData().then(this.insertNewParent)
      }
    },
    insertNewParent() {
      this.isTableEditing = true
      this.scrollTableData.forEach(element => {
        if (element.isParent && element.expand) {
          element.expand = false
        } else if (element.isChild && !element.isHide) {
          element.isHide = true
        }
      })

      const newId = Date.now()
      this.newingId = newId
      this.scrollTableData = [
        {
          id: this.newingId,
          expand: false,
          isParent: true,
          isNew: true,
          showId: 'new',
        }
      ].concat(this.scrollTableData)

      this.$refs.scrollBodyWrapperDiv.scrollTop = 0
      this.$refs.scrollBodyWrapperDiv.scrollLeft = 0
    },
    addNewChild(parentId) {
      this.scrollTableData = this.scrollTableData.reduce(
        (accumulator, currentValue) => {
          accumulator.push(currentValue)
          const newId = Date.now() + 'child'
          if (currentValue.id === parentId && !currentValue.isChild) {
            currentValue.expand = true
            this.isTableEditing = true
            this.newingId = newId
            accumulator.push({
              id: newId,
              isChild: true,
              isNew: true,
              parentId: parentId
            })
          }
          if (currentValue.parentId === parentId) {
            currentValue.isHide = false
          }

          return accumulator
        },
        []
      )
    },
    cancelAdd() {
      this.isTableEditing = false
      this.modiingId = ''
      this.clearInputContent()

      if (this.newingId) {
        this.scrollTableData = this.scrollTableData.filter(
          item => item.id !== this.newingId
        )
        this.newingId = null
      }
      if (this.modiingId) this.modiingId = null
    },
    handleModi(entry) {
      this.isTableEditing = true
      this.modiingId = entry.id
      this.clearInputContent()
      this.entryContent.inputName = entry.eventName ? entry.eventName : ''
      this.entryContent.eventType = entry.eventType
      this.entryContent.eventRuleExpr = entry.eventRuleExpr
      this.entryContent.inputDesc = entry.taskOrEvenetDesc
      this.entryContent.assigneeId = entry.assigneeId
      this.entryContent.executionDay = entry.executionDay
      this.entryContent.notifyConfig = entry.notifyConfig
      this.entryContent.status = 0
      this.entryContent.eventCreatorId = entry.eventCreatorId || ''
      this.assigneeDepartmentId = entry.assigneeDepartmentId
    },
    isSaveButtonShow(item) {
      if (item.isNew) return true
      if (item.id === this.modiingId) return true
      return false
    },
    isCancelButtonShow(item) {
      if (item.isNew) return true
      if (item.id === this.modiingId) return true
      return false
    },
    isModiButtonShow(item) {
      const isModi = item.id === this.modiingId
      if (item.isNew || isModi) return false
      return true
    },
    isAddChildButtonShow(item) {
      const isModi = item.id === this.modiingId
      if (!item.isChild && !item.isNew && !isModi) return true
      return false
    },
    onDepartmentChange() {
      this.getFollowManOptions(this.assigneeDepartmentId)
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
    // 这个事件类型是不是系统内置
    isSystemEventType(eventType) {
      const found = this.eventTypeList.find(_ => Number(_.id) === Number(eventType))
      if (found) {
        return found.systemType === 'SYSTEM'
      }
      return true
    }
  },
  setting
}
</script>


<style lang="less">
.operate-event-type-table .task-container .table-container td span.text-overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.operate-event-type-table {
  height: 100%;
  box-sizing: border-box;
  // background-color: #f9f9f9;
  position: relative;
  padding: 0 30px;
  .task-button {
    height: 70px;
    line-height: 70px;
    .el-button {
      color: #ffffff;
      background: #2cbcb1;
      height: 40px;
      width: 120px;
      font-size: 14px;
    }
    .el-button--success {
      color: #fff;
      border-color: #2cbcb1;
    }
    .el-button--success:hover {
      background: #56c9c1;
      border-color: #56c9c1;
      color: #fff;
    }
  }

  .task-container {
    height: calc(100% - 70px);
    box-sizing: border-box;
    background-color: #ffffff;
    position: relative;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
  }

  .table-title {
    height: 48px;
    line-height: 48px;
    box-sizing: border-box;
    border-bottom: 1px solid #e2e2e2;
    .dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 12px;
      background-color: #578ae3;
      margin: 0 10px 0 20px;
    }
  }

  .table-page {
    position: absolute;
    bottom: 8px;
    right: 0;
  }

  .tdHidden {
    visibility: hidden;
  }
  .table-fixed-left {
    border-right: 0;
    box-shadow: none;
    transition: box-shadow 0.3s ease;
  }
  .table-fixed-right {
    border-left: 0;
    box-shadow: none;
    transition: box-shadow 0.3s ease;
  }
  .table-fixed-left-scroll {
    box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.2);
  }
  .table-fixed-right-scroll {
    box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.2);
  }

  .table-container {
    background-color: #ffffff;
    position: absolute;
    top: 70px;
    left: 22px;
    right: 20px;
    bottom: 50px;

    table {
      table-layout: fixed;

      th,
      td {
        font-size: 13px;
        padding: 0;
        padding-left: 8px;
        height: 40px;
        // background-color: #f9f9f9;
      }
      .hasBackground {
        td {
          background-color: #f9f9f9;
        }
      }
    }
  }

  .new-table {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border: 1px solid #ebeef5;

    &__header-wrapper {
      width: 100%;
      overflow: hidden;

      table {
        th {
          background-color: #00559f;
          color: #ffffff;
          padding-left: 8px;
          .expand-icon {
            display: inline-block;
            width: 15px;
            height: 15px;
            margin-right: 3px;
            color: #578ae3;
            cursor: pointer;
            font-size: 12px;
            .expand-icon-box {
              padding: 0 0;
              line-height: 15px;
              height: 15px;
              transition: transform 0.2s ease-in-out;
              text-align: center;
              vertical-align: middle;
              img {
                height: 15px;
              }
            }

            i {
              font-weight: 600;
            }
          }
          .expand-icon--expanded {
            transform: rotate(180deg);
          }
        }
      }
    }

    &__body-main-wrapper {
      position: relative;
      height: calc(100% - 42px);
      overflow: auto;
      border-top: 1px solid #ebeef5;
    }

    &__body-left-wrapper {
      position: absolute;
      top: 41px;
      left: 0;
      height: calc(100% - 50px);
      width: 260px;
      overflow: hidden;
    }

    &__body-right-wrapper {
      position: absolute;
      top: 41px;
      right: 5px;
      height: calc(100% - 50px);
      width: 195px;
      overflow: hidden;
    }
  }

  .table-header-main {
    width: 100%;
    overflow: hidden;
  }

  .table-header-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 260px;
    overflow-x: hidden;
  }

  .table-header-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    overflow-x: hidden;
  }

  .table-body-main {
    width: 100%;
    height: 100%;
    table {
      tr {
        .el-input {
          .el-input__inner {
            height: 28px;
            line-height: 28px;
          }
        }
        .el-input-number {
          .el-input-number__decrease {
            border-radius: 14px 0 0 14px;
          }
          .el-input-number__increase {
            border-radius: 0 14px 14px 0;
          }
        }
      }
    }
  }

  .table-body-left,
  .table-body-right {
    height: 100%;
    width: 100%;
    tr {
      td {
        z-index: 2;
        .parent-indent {
          vertical-align: middle;
          .icon-folder {
            width: 18px;
            padding-right: 12px;
          }
        }
        .child-indent {
          padding-left: 20px;
          color: #00559f;
          box-sizing: border-box;
          .icon-document {
            width: 16px;
            padding-right: 10px;
            vertical-align: middle;
          }
        }
        .showId {
          color: #568be2;
        }
        .el-button {
          color: #4d73b7;
          .icon-modify,
          .add-child {
            padding-right: 2px;
            height: 15px;
          }
        }
        .el-button + .el-button {
          margin-left: 14px;
        }
        .save-button,
        .cancel-button {
          color: #fff;
          border-radius: 12px;
          width: 68px;
          height: 28px;
        }
        .save-button {
          background-color: #2cbcb1;
        }
        .save-button:hover {
          background: #56c9c1;
          border-color: #56c9c1;
        }
        .cancel-button {
          background-color: #00559f;
        }
        .cancel-button:hover {
          background: #3375b1;
          border-color: #3375b1;
        }

        .expand-icon {
          display: inline-block;
          width: 15px;
          height: 16px;
          margin-right: 3px;
          color: #578ae3;
          cursor: pointer;
          font-size: 12px;
          .expand-icon-box {
            height: 16px;
            line-height: 15px;
            vertical-align: middle;
            text-align: center;
            transition: transform 0.2s ease-in-out;
          }

          i {
            font-weight: 600;
          }
        }
        .expand-icon--expanded {
          transform: rotate(180deg);
        }
      }
    }
  }

  .el-table {
    font-size: 13px;
  }

  .el-select .el-input.is-focus .el-input__inner {
    border-color: #00559f;
  }
  .el-input,
  .el-select {
    .el-input__inner {
      border-radius: 30px;
    }
    .el-input__inner:focus {
      border-color: #00559f;
      outline: 0;
    }
    .el-select-dropdown__item.selected {
      color: #00559f;
    }
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #00559f;
  }
}

.el-loading-mask {
  z-index: 2;
  .path {
    stroke: #00559f;
  }
}

// 事件管理对话框
.operate-event-type-table__event-type {
  padding-bottom: 20px;
  .el-dialog__body {
    border-bottom: 0;
  }
  &-btns {
    margin-bottom: 10px;
    .el-button {
      color: #ffffff;
      background: #2cbcb1;
      border-radius: 16px;
      border-color: #2cbcb1;
    }
    .el-button:hover {
      background: #56c9c1;
      border-color: #56c9c1;
      color: #fff;
    }
  }
  &-table {
    button.el-button--text {
      color: #00559f;
    }

    table.el-table__header > thead > tr {
      & > th {
        background-color: #00559f;
      }
      color: #fff;
    }
  }
}
</style>
