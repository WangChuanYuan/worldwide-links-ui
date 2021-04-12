<template>
  <el-container style="text-align: center">
    <el-aside width="900px" class="bg"></el-aside>
    <div class="login">
      <div style="margin: 30px auto 30px auto;">
        <span class="logo">WorldWide Links</span>
      </div>
      <el-form :model="loginForm" ref="loginForm" :rules="loginRule" class="center" style="width: 65%">
        <el-form-item prop="id" label="账号">
          <el-input v-model="loginForm.id" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login('loginForm')">登录</el-button>
          <el-button type="success" @click="register('loginForm')">注册并登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        id: null,
        password: null
      },
      loginRule: {
        id: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    login: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Api.post('/login', {
            'id': this.loginForm.id,
            'password': this.loginForm.password,
          }).then((data) => {
            if (data.code === "SUCCESS") {
              let user = data.value;
              if (sessionStorage.getItem('id') !== user.id) {
                sessionStorage.clear();
                sessionStorage.setItem('id', user.id);
                sessionStorage.setItem('user', JSON.stringify(user));
              }
              this.$router.push('/managerCenter/registration');
            } else {
              this.$message.warning(data.msg);
            }
          });
        }
      });
    },
    register: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Api.post('/login', {
            'id': this.loginForm.id,
            'password': this.loginForm.password,
          }).then((data) => {
            if (data.code === "SUCCESS") {
              let user = data.value;
              if (sessionStorage.getItem('id') !== user.id) {
                sessionStorage.clear();
                sessionStorage.setItem('id', user.id);
                sessionStorage.setItem('user', JSON.stringify(user));
              }
              this.$router.push('/managerCenter/registration');
            } else {
              this.$message.warning(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.bg {
  /*width: 800px;*/
  height: 100vh;
  /*margin: 0 auto;*/
  background-image: url('../assets/image/iot.jpeg');
  background-repeat: no-repeat;
  background-position: center;
  /*background-size: cover;*/
  /*overflow: auto;*/
}

.logo {
  font-size: 25px;
  text-align: center;
  -webkit-text-stroke: 2px var(--theme-blue);
  letter-spacing: 0.04em;
}

.login {
  position: fixed;
  top: 20%;
  left: 58%;
  height: 55%;
  width: 28%;
  border: 2px solid var(--theme-blue);
  border-radius: 6px;
  /* 透明 */
  background: #fff;
  opacity: 0.85;
  filter: alpha(opacity:85);
}
</style>