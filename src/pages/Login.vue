<template>
  <div class="wrapper" @click="saveUserData">
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">众享天下系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
    <div class="video-container">
      <video autoplay loop class="fillWidth" :style="fixStyle">
          <source src="../../static/video/abc.mp4" type="video/mp4" />
      </video>
    </div>
  </div>
</template>

<script>
import { requestCommon } from '../api/api'
import NProgress from 'nprogress'
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: 'admin',
        checkPass: '123456'
      },
      rules2: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          //{ validator: validaePass2 }
        ]
      },
      checked: true,
      fixStyle: {}
    }
  },
  created() {
    this.$nextTick(() => {
      this._initVedio()
      this._changeVedio()
    })
  },
  methods: {
    // 初始化背景图
    _initVedio() {
      const windowWidth =
        document.documentElement.clientWidth || document.body.clientWidth
      const windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      const windowAspectRatio = windowHeight / windowWidth
      var videoHeight = 0
      var videoWidth = 0
      if (windowAspectRatio < 0.5625) {
        videoWidth = windowWidth
        videoHeight = videoWidth * 0.5625
        this.fixStyle = {
          height: windowWidth * 0.5625 + 'px',
          width: windowWidth + 'px'
          // "margin-bottom": (windowHeight - videoHeight) / 2 + "px",
          // "margin-left": "initial"
        }
      } else {
        videoHeight = windowHeight
        videoWidth = videoHeight / 0.5625
        this.fixStyle = {
          height: windowHeight + 'px',
          width: windowHeight / 0.5625 + 'px'
          // "margin-left": (windowWidth - videoWidth) / 2 + "px",
          // "margin-bottom": "initial"
        }
      }
    },
    // onresize改变背景图
    _changeVedio() {
      window.onresize = () => {
        this._initVedio()
      }
      window.onresize()
    },
    // 重置表单
    handleReset2() {
      this.$refs.ruleForm2.resetFields()
    },
    // 提交表单  等待登录接口！
    handleSubmit2(ev) {
      var _this = this
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          //_this.$router.replace('/table');
          this.logining = true
          NProgress.start()
          let url = 'api/login/userlogin'
          var loginParams = {
            username: this.ruleForm2.account,
            password: this.ruleForm2.checkPass
          }
          requestCommon(url, loginParams).then(data => {
            this.logining = false
            NProgress.done()
            let { msg, code, user } = data
            if (code !== 200) {
              this.$notify({
                title: '错误',
                message: msg,
                type: 'error'
              })
            } else {
              sessionStorage.setItem('user', JSON.stringify(user))
              this.$router.push({ path: '/table' })
            }
          })
        } else {
          this.$notify({
            title: '错误',
            message: '提交错误',
            type: 'error'
          })
          return false
        }
      })
    },
    // 存储登录数据
    saveUserData() {
      console.log(this.$store)
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
.wrapper
    position relative
    width 100vw
    height 100vh
    .login-container
        /* box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02); */
        -webkit-border-radius 5px
        border-radius 5px
        -moz-border-radius 5px
        background-clip padding-box
        z-index 100
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        margin auto
        width 350px
        height 300px
        padding 35px 35px 15px 35px
        background #fff
        border 1px solid #eaeaea
        // box-shadow 0 0 25px #cac6c6
        .title
            margin 0px auto 40px auto
            text-align center
            color #505458
            letter-spacing 5px
        .remember
            margin 0px 0px 35px 0px
    .video-container
        height 100vh
        overflow hidden
        .fillWidth
            z-index 0
</style>