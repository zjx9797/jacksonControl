<template>
  <div class="operate-upload">
    <el-card>
      <div slot="header">
        <div class="dot-icon" />
        <span class="title-text">上传数据</span>
      </div>
      <div class="content-box">
        <el-form :model="uploadData" ref="uploadData">
          <div class="el-upload-box">
            <el-form-item
              prop="serviceType"
              label="业务类型："
              :rules="[{ required: true, message: '请选择业务类型',trigger: 'change'}]"
            >
              <el-select
                v-model="uploadData.serviceType"
                @change="changeServiceType"
                clearable
              >
                <el-option
                  v-for="item in serviceTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              label="业务："
              prop="services"
              :rules="[{required: true, message: '请选择业务', trigger: 'change'}]"
            >
              <el-select
                v-model="uploadData.services"
                clearable
              >
                <el-option
                  v-for="item in serviceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              label="上传数据文件："
              class="upload-button"
              prop="fileList"
              :rules="[{ required: true, message: '请选择上传文件',trigger: 'change'}]"
            >
              <el-upload
                ref="upload"
                action
                accept=".xls, .xlsx, .csv"
                :show-file-list="true"
                :on-change="handleChange"
                :before-upload="beforeUpload"
                :auto-upload="false"
                :http-request="fileUpload"
                :multiple="false"
                :limit="1"
              >
                <el-button
                  slot="trigger"
                  size="small"
                  type="success"
                >
                  <img class="icon-upload" src="../src/assets/imgs/upload.svg" /> 上传文件
                </el-button>
                <span class="upload-remind" slot="tip">上传文件格式为 .xls/.xlsx/.csv，大小不超过200MB</span>
              </el-upload>
            </el-form-item>
          </div>

          <div class="submit-box">
            <el-button
              class="button-upload"
              size="middle"
              @click="submitForm('uploadData')"
              type="success"
            >
              确认
            </el-button>
            <el-button
              class="button-cancel"
              size="middle"
              @click="cancelUpload"
            >
              取消
            </el-button>
          </div>
        </el-form>
      </div>
    </el-card>

    <el-card style="margin-top: 10px;">
      <div slot="header">
        <div class="dot-icon" />
        <span class="title-text">运作KPI文件上传</span>
      </div>
      <div class="upload-button">
        <el-upload
          ref="kpiUpload"
          action
          :auto-upload="true"
          :http-request="kpiFileUpload"
          :multiple="false"
          :show-file-list="false"
          :limit="1"
        >
          <el-button
            slot="trigger"
            size="small"
            type="success"
            :loading="uploadingKPI"
          >
            <img class="icon-upload" src="../src/assets/imgs/upload.svg" /> 上传文件
          </el-button>
        </el-upload>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'operate-upload',
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
    this.val.config.forEach(item => {
      if (item.name === '数据接口') {
        this.prefix = item.items.find(sign => sign.key === 'apiPrefix').value
      }
    })
  },
  mounted() {
    this.getSerTypeOptions()
  },
  data() {
    return {
      token: null,
      businessesResData: [],
      serviceTypeOptions: [],
      serviceOptions: [],
      titleFontStyle: {},
      contentFontStyle: {},
      uploadData: {
        services: '',
        serviceType: '',
        fileList: ''
      },
      prefix: '',
      uploadingKPI: false
    }
  },
  computed: {
    items() {
      return [].concat(
        ...this.val.config
          .filter(panel => panel.items)
          .map(panel => panel.items)
      ) // 获取有 items 者的 items...
    }
  },
  methods: {
    getSerTypeOptions() {
      $.ajax({
        url: `${this.prefix}/datasource/getModules`,
        type: 'GET',
        headers: {
          Token: this.token
        },
        xhrFields: {
          withCredentials: true
        },
        success: res => {
          if (res.success) {
            let optionData = {}
            this.businessesResData = res.data
            this.serviceTypeOptions = []
            res.data.forEach((item, index) => {
              if (!optionData[item.moduleNameAlias]) {
                this.serviceTypeOptions.push({
                  value: index,
                  label: item.moduleNameAlias,
                  moduleName: item.moduleName
                })
                optionData[item.moduleNameAlias] = item.moduleNameAlias
              }
            })
          }
        }
      })
    },
    changeServiceType(selectIndex) {
      this.serviceOptions = []
      this.uploadData.services = ''
      let moduleNameAlias = this.businessesResData[selectIndex].moduleNameAlias
      this.businessesResData.forEach(item => {
        if (item.moduleNameAlias === moduleNameAlias) {
          this.serviceOptions.push({
            value: item.tableName,
            label: item.tableNameAlias
          })
        }
      })
    },
    handleChange(file, fileList) {
      this.uploadData.fileList = fileList
      if (fileList.length && fileList.length >= 1) {
        /*清除上一步不通过时的提示*/
        this.$refs.uploadData.validateField('fileList')
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$refs.upload.submit()
        }
      })
    },
    cancelUpload() {
      this.$refs.upload.clearFiles()
      this.uploadData = {
        services: '',
        serviceType: '',
        fileList: ''
      }
    },
    beforeUpload(file) {
      this.uploadData.fileList = file
      const reg = /\.(xlsx?|csv)$/i
      const isLt200M = file.size / 1024 / 1024 < 200

      if (!isLt200M) {
        this.$message.error('上传文件大小不能超过 200MB!')
      }
      return isLt200M
    },
    fileUpload() {
      let formData = new FormData()
      let typeIndex = this.uploadData.serviceType
      formData.append('file', this.uploadData.fileList)
      formData.append(
        'moduleName',
        this.businessesResData[typeIndex].moduleName
      )
      formData.append('tableName', this.uploadData.services)
      $.ajax(
        {
          url: `${this.prefix}/datasource/upload`,
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
        }
      ).then(res => {
        this.$refs.upload.clearFiles()
        // this.uploadData.services = "";
        // this.uploadData.serviceType = "";
        this.uploadData.fileList = ''
        if (res.success) {
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message ? '上传失败！ ' + res.message : '上传失败'
          })
        }
      })
    },
    kpiFileUpload(params) {
      const formData = new FormData()
      formData.append('file', params.file)
      this.uploadingKPI = true
      $.ajax(
        {
          url: `${this.prefix}/file/upload/kpi`,
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
        }
      ).then(res => {
        this.$refs.kpiUpload.clearFiles()
        this.uploadingKPI = false
        if (res.success) {
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
        } else {
          this.$message({
            type: 'warning',
            message: res.message ? '上传失败！ ' + res.message : '上传失败'
          })
        }
      })
    },
    // 外部数据渲染
    initComponentsData(data) {
    }
  },
  setting: {
    title: '组件标题',
    config: [{
      name: '数据接口',
      items: [{
        key: 'apiPrefix',
        label: '域名',
        type: 'panel-input',
        value: '/jsonctrmgt',
        // value: 'http://jsonctr.dev.datastory.com.cn'
      }]
    }]
  }
}
</script>

<style lang="less">
.operate-upload {
  width: 100%;
  box-sizing: border-box;
  position: relative;
  background: #fff;

  .title-box {
    width: 100%;
    position: relative;
    vertical-align: middle;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    padding-left: 20px;
    height: 50px;
    line-height: 50px;

    .dot-icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 12px;
      background-color: #578ae3;
      margin: 0 10px 0 1px;
      position: absolute;
      top: 50%;
      transform: translate(0%, -50%);
    }

    .title-text {
      position: absolute;
      top: 50%;
      transform: translate(0%, -50%);
      padding-left: 22px;
      color: #666666;
      font-size: 14px;
    }
  }

  .el-upload {
    margin-right: 20px;

    .el-button--mini,
    .el-button--small {
      font-size: 13px;
      border-radius: 4px;
    }

    .el-button--success {
      color: #fff;
      background-color: #28a99f;
      border-color: #28a99f;
    }

    .el-button--success:hover {
      background: #56c9c1;
      border-color: #56c9c1;
      color: #fff;
    }
  }

  .upload-button {
    height: auto;
    margin-bottom: 8px;

    .icon-upload {
      width: 13px;
      margin-right: 3px;
    }

    .el-form-item__content {
      height: auto;

      .el-form-item__error {
        top: 100%;
        left: 0px;
      }
    }

    .upload-remind {
      color: #c0c4cc;
    }

    .el-upload-list {
      .el-upload-list__item:hover {
        background-color: #fff;
      }

      .el-upload-list__item:focus {
        outline: -webkit-focus-ring-color auto 0px;
      }

      .el-upload-list__item {
        font-size: inherit;

        .el-upload-list__item-name {
          display: inline-block;
          margin-right: 0px;
          padding-right: 20px;
          color: #222;
        }

        .el-icon-close {
          right: auto;
          display: inline-block;
        }

        .el-icon-close:before {
          content: "删除";
          color: #2cbcb1;
          font-size: 12px;
        }

        .el-upload-list__item-name:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }

  .content-box {
    width: 100%;
    position: relative;
    font-size: 14px;

    .el-form {
      width: 100%;

      .el-upload-box {
        width: 100%;
        border-bottom: 1px solid #e2e2e2;
        box-sizing: border-box;
        position: relative;
        padding: 1% 0;

        .el-form-item {
          margin-bottom: 20px;
          height: 34px;

          .el-form-item__label {
            font-size: inherit;
            width: 128px;
            padding: 0px 6px 0 0;
          }

          .el-form-item__content {
            font-size: inherit;
            margin-left: 128px;
            height: 30px;
            color: #989898;

            .el-select {
              width: 360px;

              .el-input {
                font-size: inherit;

                input {
                  height: 30px;
                }
              }
            }

            .el-form-item__error {
              top: calc(50% - 6px);
              left: 366px;
            }
          }
        }
      }

      .submit-box {
        width: 100%;
        box-sizing: border-box;
        position: relative;
        padding: 10px 20px;
        overflow: hidden;

        .el-button {
          float: right;
          width: 80px;
          height: 40px;
        }

        .el-button--success {
          color: #fff;
          background-color: #28a99f;
          border-color: #28a99f;
        }

        .el-button--success:hover {
          background: #56c9c1;
          border-color: #56c9c1;
          color: #fff;
        }

        .button-cancel {
          margin-right: 14px;
          color: #28a99f;
          background-color: #fff;
          border-color: #28a99f;
        }

        .button-cancel:hover {
          border-color: #b3cbe2;
          background-color: #e6eef5;
        }
      }
    }
  }
}

.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border-color: #c0c4cc;
}
</style>
