<template>
  <div class="js-login">
    <div class="js-login__box">
      <img src="@/assets/logo.png" class="js-login__logo" alt="">
      <div class="js-login__form-row">
        <i class="ds-icon-login-account" />
        <input
          type="text"
          v-model="username"
          placeholder="请输入账号"
          @keypress.enter="login"
        >
      </div>
      <div class="js-login__form-row">
        <i class="ds-icon-login-password" />
        <input
          type="password"
          v-model="password"
          placeholder="请输入密码"
          @keypress.enter="login"
        >
      </div>
      <div class="js-login__tips">
        <i v-show="tips" class="el-icon-warning" />
        {{ tips }}
      </div>
      <el-button
        class="js-login__submit"
        type="primary"
        :loading="loading"
        @click="login"
      >
        {{ buttonText }}
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'js-login',
  props: ['val'],
  data() {
    return {
      username: '',
      password: '',
      tips: '',
      loading: false
    }
  },
  computed: {
    buttonText() {
      return this.loading ? '登 录 中...' : '登 录'
    }
  },
  methods: {
    login() {
      this.tips = ''
      if (!this.username) {
        this.tips = '请输入用户名'
        return
      }
      if (!this.password) {
        this.tips = '请输入密码'
        return
      }
      this.loading = true
      this.$emit('login', {
        username: this.username,
        password: this.password
      })
    },
    afterLogin({ success, message }) {
      if (!success) {
        this.tips = message
        this.loading = false
      }
    }
  },
  setting: {}
}

</script>

<style lang="less">
.js-login {
  height: 100%;
  box-sizing: border-box;
  background-image: url('~@/assets/bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;

  &__box {
    height: 480px;
    max-width: 400px;
    min-width: 250px;
    width: 20.8vw;
    transform: translateY(-50px);
  }
  &__logo {
    width: 100%;
    margin-bottom: 60px;
  }
  &__form-row {
    box-sizing: border-box;
    position: relative;
    &:nth-child(2) {
      margin-bottom: 28px;
    }
    i {
      color: #fff;
      font-size: 16px;
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
    }
    input {
      border-radius: 10px;
      border: 1px solid rgba(202, 202, 202, 0.8);
      background-color: rgba(255, 255, 255, 0.1);
      outline: 0;
      color: #ffffff;
      width: 100%;
      height: 100%;
      font-size: 14px;
      padding: 14px 16px;
      padding-left: calc(18px + 3.33vh);
      box-sizing: border-box;
      &::placeholder {
        color: rgba(255, 255, 255, 0.2);
      }
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px #050769 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
    input:focus {
      border-color: rgba(141, 198, 63, 0.8);
    }
  }
  &__tips {
    color: #8dc63f;
    font-size: 14px;
    margin-top: 13px;
    margin-bottom: 33px;
    height: 16px;
    i {
      font-size: 16px;
      margin-right: 2px;
      vertical-align: text-bottom;
    }
  }

  &__submit {
    width: 100%;
    height: 52px;
    background-color: #80b01e;
    color: #fff;
    font-size: 1.375rem;
    border-radius: 10px;
    border-color: #80b01e;
    &:hover, &:focus {
      background-color: #80b01e;
      border-color: #80b01e;
    }
  }
}

@media screen and (max-width: 1660px) {
  .js-login__submit {
    font-size: 18px;
    height: 40px;
  }
}
</style>
