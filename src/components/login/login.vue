<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="loginFrom">
      <h2>用户登录</h2>
      <el-form-item label="账号">
        <el-input v-model="loginFrom.username" prefix-icon="el-icon-user-solid"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input show-password v-model="loginFrom.password" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-button @click.prevent="handLogin()" type="primary" class="login-btn">登陆</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'login',
  data () {
    return {
      loginFrom: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    async handLogin () {
      const res = await this.$axios.post('/login', this.loginFrom).then(res => {
        // 登陆成功
        // 跳转home

        // 不成功
        // 提示信息
        const {
          data,
          meta: { msg, status }
        } = res.data
        if (status === 200) {
          // 登陆成功保存token值
          sessionStorage.setItem('token', data.token)

          this.$router.push({ name: 'home' })
          this.$message({
            message: msg,
            type: 'success'
          })
        } else {
          this.$message.error(msg)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.login-wrap {
  height: 100%;
  background: #324152;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 350px;
    background: #fff;
    border-radius: 4px;
    padding: 30px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>
