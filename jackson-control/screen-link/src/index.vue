<template>
  <div class="screen-link">
    <div
      v-for="btn in btns"
      :key="btn.name"
      class="screen-link__button"
      :class="{
        'active': btn.name === currentBtnName
      }"
      :style="{ width: `${btn.width}px` }"
      @click.stop="onBtnClick(btn)"
    >
      {{ btn.name }}
    </div>
  </div>
</template>

<script>

export default {
  name: 'screen-link',
  props: ['val'],
  computed: {
    officialAppPermissions() {
      return this.$store.state.officialAppPermissions
    },
    isEdit() {
      return this.$store.state.env === 'develop'
    },
    btns() {
      const btns = []
      if (this.isEdit || this.officialAppPermissions.find(_ => _.name.startsWith('实时模块-运作指挥中心'))) {
        btns.push(this.isChinese ? {
          name: '实时',
          hashPrefix: '#/lego/338/724',
          hash: '/lego/338/724/preview/2422',
          width: 50
        } : {
          name: 'RT',
          hashPrefix: '#/lego/338/1447',
          hash: '/lego/338/1447/preview/3536',
          width: 50
        })
      }
      if (this.isEdit || this.officialAppPermissions.find(_ => _.name.startsWith('管理模块-运作指挥中心'))) {
        btns.push(this.isChinese ? {
          name: '管理',
          hashPrefix: '#/lego/338/238',
          hash: '/lego/338/238/preview/2433',
          width: 50
        } : {
          name: 'MG',
          hashPrefix: '#/lego/338/1446',
          hash: '/lego/338/1446/preview/3533',
          width: 50
        })
      }
      if (this.isEdit || this.officialAppPermissions.find(_ => _.name.startsWith('客户体验-运作指挥中心'))) {
        btns.push(this.isChinese ? {
          name: '客户',
          hashPrefix: '#/lego/338/725',
          hash: '/lego/338/725/preview/2424',
          width: 50
        } : {
          name: 'CS',
          hashPrefix: '#/lego/338/1448',
          hash: '/lego/338/1448/preview/3537',
          width: 50
        })
      }
      if (this.isEdit || this.officialAppPermissions.find(_ => _.name.startsWith('驱动运营-运作指挥中心'))) {
        btns.push({
          name: '驱动运营',
          hashPrefix: '##',
          hash: '/lego/338/1021/preview/2556',
          width: 90
        })
      }
      btns.push({
        name: '退出',
        hashPrefix: '##',
        width: 50
      })
      btns.push(this.isChinese ? {
        name: '英文',
        hashPrefix: '##',
        hash: '',
        // 中英文跳转需要根据不同的页面来跳
        hashLanguage: [{
          hashPrefix: '#/lego/338/724',
          hash: '/lego/338/1447/preview/3536'
        }, {
          hashPrefix: '#/lego/338/238',
          hash: '/lego/338/1446/preview/3533'
        }, {
          hashPrefix: '#/lego/338/725',
          hash: '/lego/338/1448/preview/3537'
        }],
        width: 50
      } : {
        name: 'CN',
        hashPrefix: '##',
        hash: '',
        hashLanguage: [{
          hashPrefix: '#/lego/338/1447',
          hash: '/lego/338/724/preview/2422'
        }, {
          hashPrefix: '#/lego/338/1446',
          hash: '/lego/338/238/preview/2433'
        }, {
          hashPrefix: '#/lego/338/1448',
          hash: '/lego/338/725/preview/2424'
        }],
        width: 50
      })
      return btns
    },
    // 当前处于哪个页面
    currentBtnName() {
      const hash = window.location.hash
      const currentBtn = this.btns.find(btn => hash.startsWith(btn.hashPrefix))
      if (currentBtn) {
        return currentBtn.name
      }
      return ''
    },
    getPageVal() {
      return this.val.config.find(item => item.key === 'page-attr')
    },
    isChinese() {
      return this.getPageVal.items.find(item => item.key === 'isChinese').value
    }
  },
  mounted() {
    console.log('权限点配置(Offical)', this.officialAppPermissions)
  },
  methods: {
    async onBtnClick(btn) {
      if (btn.name === '退出') {
        const { success } = await this.$proxy({
          url: '/account/logout',
          type: 'post'
        })
        this.$router.push('/login')
        return
      }
      if (btn.name === '英文' || btn.name === 'CN') {
        const hash = window.location.hash
        const findUrl = btn.hashLanguage.find(item => hash.startsWith(item.hashPrefix))
        findUrl && this.$router.push(findUrl.hash)
        return
      }
      if (btn.name !== this.currentBtnName) {
        // 删除影响的样式
        if (btn.name === '驱动运营') {
          document.querySelectorAll('[flag="screenStyle"]').forEach(_ => _.remove())
        }
        this.$router.push(btn.hash)
      }
    }
  },
  setting: {
    title: '跳转按钮',
    version: 2,
    config: [{
      name: '页面设置',
      key: 'page-attr',
      items: [{
        label: '中文页面',
        type: 'panel-switch',
        key: 'isChinese',
        value: true
      }]
    }],
    width: 300,
    height: 30
  }
}

</script>

<style lang="less">
.screen-link {
  height: 100%;
  box-sizing: border-box;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &__button {
    box-sizing: border-box;
    width: 50px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border: 1px solid rgb(4, 124, 255);
    border-radius: 4px;
    font-size: 14px;
    color: rgb(4, 124, 255);
    margin-right: 8px;
    &:not(.active):hover {
      cursor: pointer;
    }
    &.active {
      background-color: rgb(4, 124, 255);
      color: #fff;
    }
  }
}
</style>
