<template>
  <div id="bg" class="bg">
    <div class="login">
      <div class="login-title">欢迎登录</div>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
              'username',
              {
                rules: [{ required: true, message: '请输入用户名' }]
              }
            ]"
            placeholder="用户名"
          >
            <a-icon
              slot="prefix"
              type="user"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
              'password',
              {
                rules: [{ required: true, message: '请输入密码' }]
              }
            ]"
            type="password"
            placeholder="密码"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">
            登录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { post } from '../request/http'
import { message } from 'ant-design-vue'
export default {
  name: 'Login',
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      }
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'normal_login' })
  },
  mounted() {},
  methods: {
    handleSubmit(e) {
      const that = this
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log(post, values)
          post('user/login', values).then((res) => {
            console.log(res)
            if (res.code != 200) {
              message.error(res.message)
              return false
            }
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('userInfo', JSON.stringify(res.data))
            setTimeout(() => {
              that.$router.push({
                path: '/'
              })
            }, 200)
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.bg {
  width: 100vw;
  height: 100vh;
  background: #355c7d; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #c06c84,
    #6c5b7b,
    #355c7d
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #c06c84,
    #6c5b7b,
    #355c7d
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  .login {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 25%;
    height: 40%;
    border-radius: 2%;
    background: rgba(255, 255, 255, 1);
    .login-title {
      margin: 2em 0;
      font-size: 1.5em;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #3b3a3a;
      text-align: center;
    }
    /deep/.login-form {
      .ant-form-item {
        width: 80%;
        height: 5em;
        margin: 0 auto;
        .login-form-button {
          margin: 0 auto;
          width: 100%;
          height: 2.2em;
          border-radius: 1.1em;
          font-size: 20px;
        }
        input {
          font-size: 16px;
          height: 3em;
          background: #f7f7f9;
        }
      }
    }
  }
}
</style>