<template>
  <div
    v-loading="loading"
    :element-loading-text="loadingText"
    class="operate-new-table"
  >
    <div v-if="!isMinePage" class="task-button">
      <el-button
        v-if="showNewEventBtn"
        type="success"
        round
        icon="el-icon-plus"
        size="small"
        @click="addNewParent"
      >
        新增记录
      </el-button>
      <el-button
        v-if="showBatchUploadBtn"
        type="success"
        round
        icon="el-icon-upload"
        size="small"
        @click="selectBatchUploadFile"
      >
        批量上传
      </el-button>
      <el-button
        type="success"
        round
        icon="el-icon-download"
        size="small"
        @click="downloadBatchTemplate"
      >
        模板下载
      </el-button>
      <el-button
        type="success"
        round
        icon="el-icon-download"
        size="small"
        @click="exportExcelFile"
      >
        导出 Excel
      </el-button>
      <input
        ref="batchUploadFile"
        type="file"
        style="display: none;"
        @change="onBatchFileUpload"
      >
    </div>
    <div class="task-container">
      <div class="table-title">
        <span class="dot"></span>
        <span>记录列表</span>
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
                    :width="column.key === 'eventDesc' ? eventDescWidth : column.width"
                  />
                </colgroup>
                <thead>
                <tr>
                  <th
                    v-for="(column, index) in headerArray"
                    :key="index+'hmTh'">
                    {{ column.title || '' }}
                  </th>
                </tr>
                </thead>
              </table>
            </div>
            <div
              class="table-header-left table-fixed-left"
              :style="{ width: `${leftWrapperWidth}px` }"
            >
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col
                    v-for="(column, index) in headerArray"
                    :key="index + 'hlCol'"
                    :width="column.key === 'eventDesc' ? eventDescWidth : column.width"
                    :class="{ 'tdHidden': column.fixed !== 'left' }"
                  />
                </colgroup>
                <thead>
                <tr>
                  <th
                    v-for="(column, index) in headerArray"
                    :key="index + 'hlTh'"
                    :class="{ 'tdHidden': column.fixed !== 'left' }"
                  >
                    <span v-if="column.title === '记录ID'" class="expand-icon" @click="isShowAllChild = !isShowAllChild">
                      <div class="expand-icon-box expand-icon--expanded">
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
                    <span>{{ column.title || '' }}</span>
                  </th>
                </tr>
                </thead>
              </table>
              <div
                class="table-fixed-left__resize-bar"
                @mousedown="startResizing($event)"
              />
            </div>
            <div class="table-header-right table-fixed-right">
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col width="150" />
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
                    :key="index + 'bmCol'"
                    :width="column.key === 'eventDesc' ? eventDescWidth : column.width"
                  />
                </colgroup>
                <tbody>
                <template v-for="(entry,index) in scrollTableData">
                  <tr
                    :key="index+'bmTr'"
                    v-if="!entry.isHide"
                    :class="{hasBackground:entry.isChild}"
                  >
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <span>{{ entry.creatorName }}</span>
                    </td>
                    <!-- 创建原因 -->
                    <td>
                      <span v-if="entry.id === editingParentEntry.id">
                        <el-input
                          v-model="editingParentEntry.createReason"
                          placeholder="请输入"
                          size="mini"
                        />
                      </span>
                      <span v-else-if="entry.id === editingChildEntry.id && !isSystemEventType(entry.eventType)">
                        <el-input
                          v-model="editingChildEntry.taskReason"
                          placeholder="请输入"
                          size="mini"
                        />
                      </span>
                      <span v-else :title="entry.reason">
                        {{ entry.reason }}
                      </span>
                    </td>
                    <!-- 状态 -->
                    <td>
                      <span v-if="entry.id === editingChildEntry.id && entry.id !== 'newChild'">
                        <el-select v-model="editingChildEntry.status" placeholder="请选择原因" size="mini">
                          <el-option
                            v-for="(value, key) in statusMap"
                            :key="key + value"
                            :value="key"
                            :label="value"
                          />
                        </el-select>
                      </span>
                      <span v-else>{{ nameStatus(entry.status) || '' }}</span>
                    </td>
                    <!-- 跟进部门 -->
                    <td>
                      <span v-if="entry.id === editingChildEntry.id">
                        <el-select
                          v-model="editingChildEntry.assigneeDepartmentId"
                          filterable
                          clearable
                          placeholder="请选择"
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
                      </span>
                      <span v-else>{{ entry.executorDepartment }}</span>
                    </td>
                    <!-- 跟进人 -->
                    <td>
                      <span v-if="entry.id === editingChildEntry.id">
                        <el-select
                          v-model="editingChildEntry.assigneeId"
                          filterable
                          placeholder="请选择"
                          size="mini"
                        >
                          <el-option
                            v-for="item in followManOptions"
                            :key="item.value + item.label"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </span>
                      <span v-else>{{ entry.executorName }}</span>
                    </td>
                    <td>
                      <span>{{ entry.createTime | formatDate }}</span>
                    </td>
                    <td>
                      <span>{{ entry.updateTime | formatDate }}</span>
                    </td>
                    <!-- 预计关闭时间 -->
                    <td>
                      <span v-if="entry.id === editingChildEntry.id && !isSystemEventType(entry.eventType)">
                        <el-date-picker
                          v-model="editingChildEntry.planTime"
                          type="datetime"
                          size="mini"
                          style="width: 180px;"
                        />
                      </span>
                      <span v-else>
                        {{ entry.planTime | formatDate }}
                      </span>
                    </td>
                    <!-- 实际关闭时间 -->
                    <td>
                      <span>{{ entry.finishedTime | formatDate }}</span>
                    </td>
                    <!-- 回顾时间 -->
                    <td>
                      <span v-if="entry.id === editingChildEntry.id
                        && (entry.id === 'newChild' || entry.operations.UPDATE_REVIEW_TIME)">
                        <el-date-picker
                          v-model="editingChildEntry.reviewTime"
                          type="datetime"
                          size="mini"
                          style="width: 180px;"
                        />
                      </span>
                      <span v-else>
                        {{ entry.reviewTime | formatDate }}
                      </span>
                    </td>
                    <td>
                      <span></span>
                    </td>
                  </tr>
                </template>
                </tbody>
              </table>
            </div>
          </div>

          <div
            :class="{
              'new-table__body-left-wrapper': true,
              'table-fixed-left': true
            }"
            ref="scrollBodyLeftWrapperDiv"
            :style="{ width: `${leftWrapperWidth}px` }"
          >
            <div class="table-body-left">
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col :width="headerArray[0].width" />
                  <col :width="headerArray[1].width" />
                  <col :width="headerArray[2].width" />
                  <col :width="eventDescWidth" />
                </colgroup>
                <tbody>
                <template v-for="(entry, index) in scrollTableData">
                  <tr
                    :key="index+'blTr'"
                    v-if="!entry.isHide"
                    :class="{ hasBackground: entry.isChild }"
                  >
                    <!-- 记录ID和展开按钮 -->
                    <td>
                      <span class="expand-icon">
                        <div
                          v-if="entry.isParent"
                          :class="{ 'expand-icon-box': true, 'expand-icon--expanded': entry.expand }"
                          @click="handleExpand(entry.id)"
                        >
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
                      <span class="showId">{{ entry.showId }}</span>
                    </td>
                    <!-- 事件名称 -->
                    <td>
                      <span v-if="entry.id === editingParentEntry.id && entry.id === 'newParent'">
                        <el-select
                          v-model="editingParentEntry.eventName"
                          filterable
                          allow-create
                          default-first-option
                          placeholder="请选择配置"
                          size="mini"
                          @change="onEventNameChange"
                        >
                          <el-option
                            v-for="item in confOptions4New"
                            :key="item.eventConfId + item.eventName"
                            :value="`##_##_${item.eventConfId}`"
                            :label="item.eventName"
                          />
                        </el-select>
                      </span>
                      <span v-else-if="entry.id === editingParentEntry.id && entry.id !== 'newParent'">
                        <el-input
                          v-model="editingParentEntry.eventName"
                          placeholder="请输入"
                          size="mini"
                        />
                      </span>
                      <span v-else-if="entry.id === editingChildEntry.id && !isSystemEventType(entry.eventType)">
                        <el-input
                          v-model="editingChildEntry.taskName"
                          placeholder="请输入"
                          size="mini"
                        />
                      </span>
                      <span v-else class="text-overflow" :title="entry.eventName">
                        {{ entry.eventName }}
                      </span>
                    </td>
                    <!-- 事件类型 -->
                    <td>
                      <span v-if="entry.id === editingParentEntry.id">
                        <el-select
                          v-model="editingParentEntry.eventType"
                          placeholder="请选择"
                          size="mini"
                          :disabled="!!editingParentEntry.eventConfId"
                        >
                          <el-option
                            v-for="item in availableEventTypeOptions"
                            :key="item.id"
                            :value="item.id"
                            :label="item.eventType"
                          />
                        </el-select>
                      </span>
                      <span v-else>{{ formatEventType(entry.eventType) }}</span>
                    </td>
                    <!-- 事件描述 -->
                    <td>
                      <span v-if="entry.id === editingParentEntry.id">
                        <el-input
                          v-model="editingParentEntry.eventDesc"
                          placeholder="请输入"
                          size="mini"
                          :disabled="!!editingParentEntry.eventConfId"
                        />
                      </span>
                      <span v-else-if="entry.id === editingChildEntry.id && !isSystemEventType(entry.eventType)">
                        <el-input
                          v-model="editingChildEntry.taskDesc"
                          placeholder="请输入"
                          size="mini"
                        />
                      </span>
                      <span v-else>{{ entry.eventDesc }}</span>
                    </td>
                  </tr>
                </template>
                </tbody>
              </table>
            </div>
          </div>

          <div
            :class="{
              'new-table__body-right-wrapper': true,
              'table-fixed-right': true,
            }"
            ref="scrollBodyRightWrapperDiv"
          >
            <div class="table-body-right">
              <table cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                <colgroup>
                  <col width="150" />
                </colgroup>
                <tbody>
                <template v-for="(entry, index) in scrollTableData">
                  <tr
                    :key="index + 'brTr'"
                    v-if="!entry.isHide"
                    :class="{ hasBackground: entry.isChild }"
                  >
                    <td>
                      <span>
                        <el-button
                          v-if="isSaveButtonShow(entry)"
                          class="save-button"
                          type="text"
                          size="mini"
                          @click="submitAddorEdit(entry)"
                        >
                          保存
                        </el-button>
                        <el-button
                          v-if="isSaveButtonShow(entry)"
                          class="cancel-button"
                          type="text"
                          size="mini"
                          @click="cancelAdd(entry)"
                        >
                          取消
                        </el-button>

                        <el-button
                          v-if="isModiButtonShow(entry)"
                          type="text"
                          size="mini"
                          @click="handleModi(entry)"
                        >
                          <img src="../src/assets/imgs/icon-modify.svg" class="icon-modify" />修改
                        </el-button>

                        <el-button
                          v-if="isAddFollowButtonShow(entry)"
                          type="text"
                          size="mini"
                          icon="el-icon-plus"
                          @click="handleAddFollow(entry)"
                        >
                          新增跟进子事件
                        </el-button>

                        <el-popover
                          v-if="isFollowTableShow(entry)"
                          placement="left"
                          v-model="entry.isRemarkTableShow"
                        >
                          <el-table :data="remarkTableData" height="250">
                            <el-table-column width="100" property="creatorName" label="跟进人" />
                            <el-table-column width="150" property="createTime" label="创建时间" />
                            <el-table-column width="150" property="remark" label="跟进描述" />
                          </el-table>
                          <el-button
                            slot="reference"
                            type="text"
                            size="mini"
                            @click="getFollowList(entry)"
                          >
                            <img src="../src/assets/imgs/processing.svg" class="icon-processing" />
                            跟进记录
                          </el-button>
                        </el-popover>

                        <el-popover
                          placement="top"
                          width="200"
                          v-if="isFollowNewShow(entry)"
                          v-model="entry.isAddRemarkShow"
                        >
                          <div class="new-remark">
                            <span>跟进描述：</span>
                            <el-input size="mini" v-model="entry.remark" />
                            <el-button type="text" size="mini" @click="sumbitFollow(entry)">确定</el-button>
                          </div>
                          <el-button
                            slot="reference"
                            type="text"
                            size="mini"
                            @click="toggleAddRemark(entry)"
                          >
                            <img src="../src/assets/imgs/follow-up.svg" class="icon-follow" />
                            新增跟进
                          </el-button>
                        </el-popover>

                        <el-button
                          v-if="isUploadShow(entry)"
                          type="text"
                          size="mini"
                          icon="el-icon-upload2"
                          @click="uploadEvent(entry, 'upload')"
                        >
                          上传
                        </el-button>

                        <el-button
                          v-if="isDownloadShow(entry)"
                          type="text"
                          size="mini"
                          icon="el-icon-download"
                          @click="uploadEvent(entry, 'down')"
                        >
                          下载
                        </el-button>
                      </span>
                    </td>
                  </tr>
                </template>
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
          :total="totalCount"
          :current-page="searchData.page"
          @current-change="currentChange"
        />
      </div>
    </div>

    <!-- 文件上传 -->
    <el-dialog
      title="文件上传"
      class="operate-new-table__dialog"
      :visible.sync="uploadData.isShow"
      :close-on-click-modal="false"
      width="400px">
      <el-upload
        class="operate-new-table__t-upload"
        drag
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :on-change="handleChange"
        :http-request="uploadFile"
        :on-remove="handleRemove"
        :limit="8"
        :auto-upload="false">
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">最多一次能上传8个文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button class="operate-new-table__t-button" @click="uploadData.isShow = false">取 消</el-button>
        <el-button class="operate-new-table__t-button" type="primary" @click="submitTableUpload">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="文件下载"
      :visible.sync="uploadData.downloadShow"
      width="400px"
      :close-on-click-modal="false">
      <div class="operate-new-table__export" v-loading="uploadData.downLoading">
        <ul v-if="uploadData.downList.length">
          <li v-for="item in uploadData.downList" :key="item.id">
            <span>{{ item.fileName }}</span>
            <span class="operate-new-table__export-icon" @click="downPort(item)">
              <i class="el-icon-download" />下载
            </span>
            <span class="operate-new-table__export-icon-again" @click="deleteFile(item)">
              <i class="el-icon-delete" />删除
            </span>
          </li>
        </ul>
        <div v-else class="operate-new-table__export-no">
          暂无数据
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import setting from './setting'
import saveEventsMixin from './mixins/save-events-mixin'
import resizeMixin from './mixins/resize-mixin'
import operationsMixin from './mixins/operations-mixin'

export default {
  name: 'operate-new-table',
  mixins: [
    saveEventsMixin,
    resizeMixin,
    operationsMixin
  ],
  props: ['val', 'customerAppPermissions'],
  data() {
    return {
      isShowAllChild: false,
      loading: false,
      loadingText: '加载中...',
      token: null,
      statusMap: {
        0: '新建',
        1: '完成',
        2: '取消',
        3: '关闭',
        4: '处理中'
      },
      followManOptions: [],
      followDepOptions: [],
      confOptions4New: [],
      // customFilter: "", //外部筛选器触发时的值
      scrollValue: 0,
      searchEventUrl: '', //方舟判断的数据接口
      headerArray: [{
        title: '记录ID',
        key: 'id',
        width: 130,
        fixed: 'left'
      }, {
        title: '事件名称',
        key: 'eventName',
        width: 110,
        fixed: 'left'
      }, {
        title: '事件类型',
        key: 'eventType',
        width: 110,
        fixed: 'left'
      }, {
        title: '事件描述',
        key: 'eventDesc',
        fixed: 'left'
      }, {
        title: '创建人名称',
        key: 'creatorName',
        width: 100
      }, {
        title: '创建原因',
        key: 'reason',
        width: 200
      }, {
        title: '状态',
        key: 'status',
        width: 120
      }, {
        title: '跟进部门',
        key: 'executorDepartment',
        width: 130
      }, {
        title: '记录跟进人',
        key: 'executorName',
        width: 150
      }, {
        title: '创建时间',
        key: 'createTime',
        width: 150
      }, {
        title: '更新时间',
        key: 'updateTime',
        width: 150
      }, {
        title: '预计关闭时间',
        key: 'planTime',
        width: 200
      }, {
        title: '实际关闭时间',
        key: 'finishedTime',
        width: 150
      }, {
        title: '回顾时间',
        key: 'reviewTime',
        width: 200
      }, {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 350
      }],
      scrollTableData: [],
      isTableEditing: false,
      // 父事件编辑记录
      editingParentEntry: {
        id: '',
        eventName: '',
        eventType: '',
        eventDesc: '',
        createReason: '',
        eventConfId: ''
      },
      // 子事件编辑记录
      editingChildEntry: {
        id: '',
        assigneeId: '',
        assigneeDepartmentId: '',
        taskName: '',
        taskDesc: '',
        planTime: '',
        taskReason: '',
        status: '',
        reviewTime: ''
      },
      totalCount: 0,
      searchData: {
        page: 1,
        size: 10,
        eventRecordId: null,
        executorId: null,
        executorDepartment: null,
        startTime: null,
        endTime: null,
        status: null
      },
      remarkTableData: [],
      uploadData: {
        isShow: false,
        downloadShow: false,
        data: {},
        downLoading: false,
        downList: []
      },
      fileList: [],
      formDate: null,
      eventTypeList: []
    }
  },
  filters: {
    // 格式化时间显示
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
  computed: {
    isMinePage() {
      return this.val.config.find(_ => _.key === 'apiSetting').items[0].value
    },
    isDebug() {
      return this.val.config.find(_ => _.key === 'debugSetting').items[0].value
    },
    prefix() {
      if (this.isDebug) {
        return 'http://jsonctr.dev.datastory.com.cn'
      }
      return this.val.config.find(_ => _.key === 'apiSetting').items[1].value
    },
    availableEventTypeOptions() {
      if (this.editingParentEntry.id === 'newParent') {
        return this.eventTypeList
      }
      return this.eventTypeList.filter(_ => _.systemType !== 'SYSTEM')
    },
    showNewEventBtn() {
      return this.customerAppPermissions.find(_ => _.frontendValue === 'new')
    },
    showBatchUploadBtn() {
      return this.customerAppPermissions.find(_ => _.frontendValue === 'upload')
    }
  },
  watch: {
    // 全部展开或全部收起
    isShowAllChild() {
      this.scrollTableData.forEach((element, index) => {
        element.expand = this.isShowAllChild
        if (element.isChild) {
          element.isHide = !this.isShowAllChild
        }
      })
    },
    'uploadData.isShow'(val) {
      this.fileList = []
      this.$nextTick(() => {
        this.$refs.upload.clearFiles()
        this.formDate = null
      })
      !val && (this.uploadData.data = [])
    },
    'uploadData.downloadShow'(val) {
      !val && (this.uploadData.data = [])
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

    // 区分是否我的运营页面的组件
    if (this.isMinePage) {
      this.searchEventUrl = `${this.prefix}/event/record/owner/list`
    } else {
      this.searchEventUrl = `${this.prefix}/event/record/list`
    }
  },
  mounted() {
    this.getTableData()
    this.getFollowManOptions()
    this.getFollowDepOptions()
    this.getRecordConfig()
    this.getEventTypeOptions()
    this.setTableShadow()
    window.addEventListener('resize', this.setTableShadow, false)
    console.log('权限点信息', this.customerAppPermissions)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableShadow, false)
  },
  methods: {
    // 格式化事件类型显示
    formatEventType(eventType) {
      const found = this.eventTypeList.find(_ => _.id === eventType)
      return found ? found.eventType : eventType
    },
    toggleAddRemark(entry) {
      entry.isAddRemarkShow = !entry.isAddRemarkShow
    },
    // 获取跟进记录列表
    getFollowList(entry) {
      $.ajax({
        url: `${this.prefix}/task/execute/${entry.taskRecordId}/list`,
        type: 'GET',
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          this.remarkTableData = res.data.map(item => {
            let newItem = {}
            newItem.creatorName = item.creatorName
            newItem.createTime = this.formatDate(item.createTime)
            newItem.remark = item.remark
            return newItem
          })
          entry.toggleAddRemark = true
        }
      })
    },
    sumbitFollow(entry) {
      entry.isAddRemarkShow = false
      $.ajax({
        url: `${this.prefix}/task/execute/${entry.taskRecordId}/insert`,
        type: 'POST',
        data: { remark: entry.remark },
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          entry.remark = ''
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }
      })
    },
    // 状态格式化函数
    nameStatus(value) {
      return this.statusMap[value]
    },
    currentChange(currentPage) {
      this.clearInputContent()
      this.searchData.page = currentPage
      this.getTableData()
    },
    // 外面筛选器改变时调用此方法
    initCustomFilterParams(params) {
      const filterData = params.customFilter
      if (filterData) {
        this.searchData.eventRecordId = filterData.eventRecordId
        this.searchData.executorId = filterData.executorId
        this.searchData.executorDepartment = filterData.executorDepartment
        this.searchData.startTime = filterData.startTime
        this.searchData.endTime = filterData.endTime
        this.searchData.eventName = filterData.eventName
        this.searchData.eventDesc = filterData.eventDesc
        this.searchData.eventType = filterData.eventType
        this.searchData.status = filterData.status
        this.searchData.page = 1
        this.totalCount = 0
        this.getTableData()
      }
    },
    onEventNameChange(params) {
      console.log(params)
      if (params.startsWith('##_##_')) {
        // 选择了内置事件名称
        const eventConfId = Number(params.substring(6))
        const eventConf = this.confOptions4New.find(_ => Number(_.eventConfId) === Number(eventConfId))
        if (eventConf) {
          this.editingParentEntry.eventConfId = eventConfId
          this.editingParentEntry.eventType = eventConf.eventType
          this.editingParentEntry.eventDesc = eventConf.eventDesc
        }
      } else {
        // 自己填写的事件名称
        this.editingParentEntry.eventConfId = undefined
      }
    },
    getTableData() {
      this.loading = true
      this.loadingText = '加载中...'
      return $.ajax({
        url: this.searchEventUrl,
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
          this.loading = false
          if (!res.success) {
            this.$message({ type: 'error', message: res.message })
            this.scrollTableData = []
            this.totalCount = 0
            return
          }

          if (!res.data || !res.data.list) {
            this.scrollTableData = []
            this.totalCount = 0
            return
          }

          const resArray = res.data.list.reduce((accumulator, currentValue) => {
            let parentItem = {}
            let childrenArray = []
            parentItem.id = currentValue.eventRecordId
            parentItem.showId = currentValue.eventRecordId
            parentItem.eventName = currentValue.eventName
            parentItem.eventType = currentValue.eventType
            parentItem.eventDesc = currentValue.eventDesc
            parentItem.creatorName = currentValue.creatorName
            parentItem.reason = currentValue.creatorReason
            parentItem.status = currentValue.status + ''
            parentItem.executorName = ''
            parentItem.executorDepartment = ''
            parentItem.createTime = currentValue.createTime
            parentItem.updateTime = currentValue.updateTime
            // 取子事件最后的预计关闭时间
            parentItem.planTime = ''
            parentItem.finishedTime = ''
            parentItem.operations = currentValue.operations
            parentItem.expand = false
            if (currentValue.taskRecordList.length > 0) {
              parentItem.isParent = true
              childrenArray = currentValue.taskRecordList.map(item => {
                let childItem = {}
                childItem.id = item.taskRecordId + 'child'
                childItem.showId = item.taskRecordId
                childItem.taskRecordId = item.taskRecordId
                childItem.eventName = item.taskName
                // 取其父事件的事件类型展示一下意思意思
                childItem.eventType = parentItem.eventType
                childItem.eventDesc = item.taskDesc
                childItem.creatorName = item.createName
                childItem.reason = item.taskReason
                childItem.status = item.status + ''
                childItem.executorId = item.executorId
                childItem.executorName = item.executorName
                childItem.executorDepartment = item.executorDepartment
                childItem.executorDepartmentId = item.executorDepartmentId
                childItem.createTime = item.createTime
                childItem.updateTime = item.updateTime
                childItem.planTime = item.planTime
                childItem.finishedTime = item.finishedTime
                childItem.isChild = true
                childItem.parentId = item.eventRecordId
                childItem.isHide = true
                childItem.remark = ''
                childItem.operations = item.operations
                childItem.reviewTime = item.reviewTime
                childItem.isAddRemarkShow = false
                childItem.isremarkTableShow = false

                if (!parentItem.planTime || (childItem.planTime && childItem.planTime > parentItem.planTime)) {
                  parentItem.planTime = childItem.planTime
                }
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
          this.totalCount = res.data.count
          this.loading = false
          this.expandAll()
        }
      })
    },
    handleBodyScroll() {
      this.scrollTopValue = this.$refs.scrollBodyWrapperDiv.scrollTop
      this.scrollLeftValue = this.$refs.scrollBodyWrapperDiv.scrollLeft

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
    // 保存记录
    submitAddorEdit(entry) {
      if (entry.id === 'newChild') {
        // 新增子事件
        if (!this.validateChildEntry()) return
        this.addChild(entry.parentId)
      } else if (entry.id === 'newParent') {
        // 新增父事件
        if (!this.validateParentEntry()) return
        this.addParent()
      } else if (entry.id === this.editingChildEntry.id) {
        // 修改子记录
        if (!this.isSystemEventType(entry.eventType) && !this.validateChildEntry()) return
        this.updateChild(entry.taskRecordId, this.isSystemEventType(entry.eventType))
      } else if (entry.id === this.editingParentEntry.id) {
        // 修改父记录
        if (!this.validateParentEntry()) return
        this.updateParent(entry.id)
      }
    },
    // 校验父事件
    validateParentEntry() {
      if (!this.editingParentEntry.eventName) {
        this.$message.error('请输入事件名称')
        return false
      }
      if (!this.editingParentEntry.eventType) {
        this.$message.error('请选择事件类型')
        return false
      }
      return true
    },
    // 校验子事件
    validateChildEntry() {
      if (!this.editingChildEntry.taskName) {
        this.$message.error('请输入事件名称')
        return false
      }
      if (!this.editingChildEntry.assigneeId) {
        this.$message.error('请选择跟进人')
        return false
      }
      if (!this.editingChildEntry.planTime) {
        this.$message.error('请选择预计关闭时间')
        return false
      }
      return true
    },
    clearInputContent() {
      this.isTableEditing = false

      // 父事件
      this.editingParentEntry.id = ''
      this.editingParentEntry.eventName = ''
      this.editingParentEntry.eventType = ''
      this.editingParentEntry.eventConfId = ''
      this.editingParentEntry.eventDesc = ''
      this.editingParentEntry.createReason = ''

      // 子事件
      this.editingChildEntry.id = ''
      this.editingChildEntry.assigneeId = ''
      this.editingChildEntry.assigneeDepartmentId = ''
      this.editingChildEntry.taskName = ''
      this.editingChildEntry.taskDesc = ''
      this.editingChildEntry.planTime = ''
      this.editingChildEntry.taskReason = ''
      this.editingChildEntry.status = ''
      this.editingChildEntry.reviewTime = ''
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
    // 插入编辑中的父记录
    insertNewParent() {
      this.clearInputContent()
      this.isTableEditing = true
      this.scrollTableData.forEach(element => {
        if (element.isParent && element.expand) {
          element.expand = false
        } else if (element.isChild && !element.isHide) {
          element.isHide = true
        }
      })

      this.editingParentEntry.id = 'newParent'

      this.scrollTableData = [{ id: 'newParent', showId: 'new' }].concat(this.scrollTableData)

      this.$refs.scrollBodyWrapperDiv.scrollTop = 0
      this.$refs.scrollBodyWrapperDiv.scrollLeft = 0
    },
    // 点击「新增跟进子事件」
    handleAddFollow(entry) {
      this.clearInputContent()
      this.isTableEditing = true
      const index = this.scrollTableData.findIndex(_ => _ === entry)
      this.scrollTableData.splice(index + 1, 0, {
        id: 'newChild',
        showId: 'new',
        isChild: true,
        isParent: false,
        eventType: entry.eventType,
        parentId: entry.id
      })
      this.editingChildEntry.id = 'newChild'
      this.editingChildEntry.taskName = entry.eventName
      this.editingChildEntry.taskDesc = entry.eventDesc
    },
    // 获取事件名称列表
    getRecordConfig() {
      $.ajax({
        url: `${this.prefix}/event/queryAll`,
        type: 'GET',
        data: {},
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          this.confOptions4New = res.data
        }
      })
    },
    // 取消编辑
    cancelAdd(entry) {
      if (entry.id === 'newParent' || entry.id === 'newChild') {
        this.scrollTableData = this.scrollTableData
          .filter(item => item.id !== 'newParent' && item.id !== 'newChild')
      }
      this.clearInputContent()
    },
    // 开始编辑
    handleModi(item) {
      this.clearInputContent()
      this.isTableEditing = true

      if (item.isChild) {
        // 编辑子事件
        if (this.isSystemEventType(item.eventType)) {
          // 内置子事件，只能编辑跟进人（部门）、状态
          this.editingChildEntry.id = item.id
          this.editingChildEntry.status = item.status
          this.editingChildEntry.assigneeId = item.executorId
          this.editingChildEntry.assigneeDepartmentId = item.executorDepartmentId
          this.editingChildEntry.reviewTime = item.reviewTime ? new Date(item.reviewTime) : ''
        } else {
          // 非内置子事件，可以编辑各种东西
          this.editingChildEntry.id = item.id
          this.editingChildEntry.status = item.status
          this.editingChildEntry.assigneeId = item.executorId
          this.editingChildEntry.assigneeDepartmentId = item.executorDepartmentId
          this.editingChildEntry.planTime = new Date(item.planTime || Date.now())
          this.editingChildEntry.taskName = item.eventName
          this.editingChildEntry.taskDesc = item.eventDesc
          this.editingChildEntry.taskReason = item.reason
          this.editingChildEntry.reviewTime = item.reviewTime ? new Date(item.reviewTime) : ''
        }
      } else {
        // 编辑父事件
        this.editingParentEntry.id = item.id
        this.editingParentEntry.eventName = item.eventName
        this.editingParentEntry.eventType = item.eventType
        this.editingParentEntry.eventDesc = item.eventDesc
        this.editingParentEntry.createReason = item.reason
      }
    },
    handleReturn(item) {
      $.ajax({
        url: `${this.prefix}/task/record/${item.taskRecordId}/rework`,
        type: 'POST',
        data: {},
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (res.success) {
            this.scrollTableData.forEach(element => {
              if (element.id === item.parentId) {
                element.status = '0'
              }
            })
            item.status = '0'
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
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
    },
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
    },
    uploadEvent(item, type) {
      this.uploadData.data = item
      if (type === 'upload') {
        this.uploadData.isShow = true
      } else {
        this.uploadData.downloadShow = true
        this.getDownList()
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    submitTableUpload() {
      if (!this.fileList.length) {
        this.$message({
          type: 'warning',
          message: '暂无文件可上传，请选择文件'
        })
        return false
      }
      this.formDate = new FormData()
      this.$refs.upload.submit()
      this.formDate.append('taskRecordId', this.uploadData.data.taskRecordId)
      $.ajax(
        {
          url: `${this.prefix}/file/upload`,
          type: 'post',
          contentType: false,
          processData: false,
          headers: {
            Token: this.token
          },
          xhrFields: {
            withCredentials: true
          },
          data: this.formDate
        }
      ).then(res => {
        if (res.success) {
          const uploadResFile = []
          Object.keys(res.data).forEach(key => {
            if (!res.data[key]) {
              uploadResFile.push(key)
            }
          })
          if (uploadResFile.length) {
            this.$message({
              type: 'error',
              message: `文件${uploadResFile.join(',')}上传失败！`
            })
          } else {
            this.$message({
              type: 'success',
              message: '上传成功！'
            })
          }
          this.$refs.upload.clearFiles()
          this.formDate = null
          this.uploadData.isShow = false
          this.fileList = []
        } else {
          this.$message({
            type: 'error',
            message: res.message ? '上传失败！ ' + res.message : '上传失败！'
          })
        }
      })
    },
    uploadFile(file) {
      this.formDate.append('files', file.file)
    },
    getDownList() {
      this.uploadData.downLoading = true
      $.ajax({
        url: `${this.prefix}/file/list`,
        type: 'GET',
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: {
          taskRecordId: this.uploadData.data.taskRecordId
        },
        success: res => {
          this.uploadData.downLoading = false
          this.uploadData.downList = res.data
        }
      })
    },
    // 下载文件
    downPort(item) {
      var xhr = new XMLHttpRequest()
      let url = `${this.prefix}/file/download/${item.id}`
      xhr.open('GET', url, true)
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
      xhr.setRequestHeader('Token', this.token)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        var blob = this.response
        let a = document.createElement('a')
        a.setAttribute('class', 'dowmLoadExample')
        a.download = item.fileName
        a.href = window.URL.createObjectURL(blob)
        a.click()
      }
      xhr.send()
    },
    // 删除文件
    deleteFile(item) {
      this.uploadData.downLoading = true
      $.ajax({
        url: `${this.prefix}/file/${item.id}/delete`,
        type: 'post',
        dataType: 'json',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          this.uploadData.downLoading = false
          if (res.success) {
            this.$message({ type: 'success', message: '删除成功！' })
            this.getDownList()
          } else {
            this.$message({ type: 'error', message: '删除失败：' + res.message })
          }
        }
      })
    },
    // 批量上传 - 选择文件
    selectBatchUploadFile() {
      this.$refs.batchUploadFile.click()
    },
    // 批量上传 - 选择文件后上传
    onBatchFileUpload(event) {
      const { files } = event.target
      if (files.length !== 1) {
        return
      }

      this.loading = true
      this.loadingText = '上传中...'
      const formData = new FormData()
      formData.append('file', files[0])
      $.ajax({
        url: `${this.prefix}/event/record/batchInsert`,
        type: 'post',
        contentType: false,
        processData: false,
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        data: formData
      }).then(res => {
        this.loading = false
        if (res.success) {
          // 刷新一下列表
          this.$message({ type: 'success', message: '上传成功' })
          this.searchData.page = 1
          this.getTableData()
          event.target.value=''
        } else {
          this.$message({
            type: 'error',
            message: res.message ? '上传失败！ ' + res.message : '上传失败！'
          })
        }
      })
    },
    // 跟进部门变更 - 重新请求跟进人列表
    onDepartmentChange() {
      this.getFollowManOptions(this.editingChildEntry.assigneeDepartmentId)
    },
    // 下载模板文件
    downloadBatchTemplate() {
      var xhr = new XMLHttpRequest()
      let url = `${this.prefix}/file/download/templateFile`
      xhr.open('GET', url, true)
      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
      xhr.setRequestHeader('Token', this.token)
      xhr.responseType = 'blob'
      xhr.onload = function () {
        var blob = this.response
        let a = document.createElement('a')
        a.setAttribute('class', 'dowmLoadExample')
        a.download = '模板文件.xlsx'
        a.href = window.URL.createObjectURL(blob)
        a.click()
      }
      xhr.send()
    },
    // 导出 Excel
    exportExcelFile() {
      this.loading = true
      this.loadingText = '导出中...'
      var xhr = new XMLHttpRequest()
      let url = `${this.prefix}/event/record/exportRecord`

      const params = {
        executorId: this.searchData.executorId,
        executorDepartment: this.searchData.executorDepartment,
        startTime: this.searchData.startTime,
        endTime: this.searchData.endTime,
        eventName: this.searchData.eventName,
        eventDesc: this.searchData.eventDesc,
        eventType: this.searchData.eventType,
        status: this.searchData.status
      }
      const paramsArr = []
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          paramsArr.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        }
      })
      xhr.open('GET', `${url}${
        paramsArr.length > 0
          ? ('?' + paramsArr.join('&'))
          : ''}`, true)

      xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
      xhr.setRequestHeader('Token', this.token)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        this.loading = false
        var blob = xhr.response
        console.log(blob.size)
        if (blob.size < 100) {
          var reader = new FileReader()
          reader.readAsText(blob)
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target.result)
              if (!data.success) {
                this.$message.error(data.message)
              }
            } catch(err) {
            }
          }
        } else {
          let a = document.createElement('a')
          a.setAttribute('class', 'dowmLoadExample')
          a.download = '导出数据.xlsx'
          a.href = window.URL.createObjectURL(blob)
          a.click()
        }
      }
      xhr.send()
    },
    expandAll() {
      this.scrollTableData.forEach((element, index) => {
        element.expand = true
        if (element.isChild) {
          element.isHide = false
        }
      })
    }
  },
  setting
}
</script>


<style lang="less">
.operate-new-table .task-container .table-container td span.text-overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.operate-new-table {
  height: 100%;
  box-sizing: border-box;
  // background-color: #f9f9f9;
  position: relative;
  padding: 0 30px;
  &__export {
    height: 300px;
    overflow: auto;
    &-no {
      margin-top: 100px;
      text-align: center
    }
    ul {
      padding-bottom: 20px;
      li {
        font-size: 13px;
        line-height: 30px;
        border: 1px solid #ccc;
        padding: 0 10px;
        padding-right: 120px;
        border-radius: 4px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      li + li {
        margin-top: 10px;
      }
    }
    &-icon {
      position: absolute;
      right: 60px;
      top: 0;
      line-height: 30px;
      cursor: pointer;
      color: #2cbcb1;
    }
    &-icon-again {
      position: absolute;
      right: 10px;
      top: 0;
      line-height: 30px;
      cursor: pointer;
      color: #2cbcb1;
    }
    &-icon:hover, &-icon-again:hover {
      color: #56c9c1;
    }
  }
  &__dialog {
    .el-dialog__body {
      padding-bottom: 20px;
    }
  }
  &__t-button {
    &.el-button:active, &.el-button:focus, &.el-button:hover {
      color: #2cbcb1;
      border-color: #2cbcb1;
      background-color: #fdffff;
    }
    &.el-button--primary {
      background: #2cbcb1;
      border-color: #2cbcb1;
    }
    &.el-button--primary:hover, &.el-button--primary:hover, &.el-button--primary:focus {
      background: #56c9c1;
      border-color: #56c9c1;
      color: #fff;
    }
  }

  &__t-upload {
    .el-upload-dragger {
      height: 150px;
    }
    .el-upload-dragger .el-icon-upload {
      margin: 20px 0 16px;
    }
    .el-upload-dragger:hover {
      border-color: #2cbcb1;
    }
  }

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
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    border-bottom: 1px solid #e2e2e2;

    .dot {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 12px;
      background-color: #578ae3;
      margin: 0 10px 0 22px;
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
    box-shadow: 6px 0 6px -4px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;
  }
  .table-fixed-right {
    border-left: 0;
    box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;
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
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
      // height: 40px;
      overflow: hidden;

      table {
        th {
          background-color: #00559f;
          color: #ffffff;
          padding-left: 7px;
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
      overflow: hidden;
    }

    &__body-right-wrapper {
      position: absolute;
      top: 41px;
      right: 5px;
      height: calc(100% - 50px);
      width: 345px;
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
    overflow-x: hidden;
  }

  .table-header-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 350px;
    overflow-x: hidden;
  }

  .table-body-main {
    width: 100%;
    height: 100%;
    // overflow-x: auto;
    table {
      tr {
        .el-input {
          .el-input__inner {
            height: 28px;
            line-height: 28px;
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
          margin-right: 8px;
          .icon-modify,
          .icon-follow,
          .icon-processing,
          .icon-redo {
            padding-right: 2px;
            height: 14px;
          }
        }
        .el-button + .el-button {
          margin-left: 0;
        }
        .save-button,
        .cancel-button {
          color: #fff;
          border-radius: 12px;
          width: 68px;
          height: 28px;
          margin-right: 0px;
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
          height: 15px;
          margin-right: 3px;
          color: #578ae3;
          cursor: pointer;
          font-size: 12px;
          .expand-icon-box {
            line-height: 15px;
            height: 15px;
            transition: transform 0.2s ease-in-out;
            text-align: center;
            vertical-align: middle;
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
    border: 1px solid #dcdfe6;
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

.new-remark {
  text-align: left;
  margin: 0;
  font-size: 13px;
  .el-button {
    color: #00559f;
  }
}

.el-loading-mask {
  z-index: 2;
  .path {
    stroke: #00559f;
  }
}

.table-fixed-left__resize-bar {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  background-color: rgba(#151E40, 0.3);
  cursor: col-resize;
}
</style>
