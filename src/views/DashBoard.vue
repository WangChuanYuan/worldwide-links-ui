<template>
  <el-container style="min-height: 100%;">
    <el-aside>
      <el-menu :default-active="this.$route.name"
               @select="navigation"
               :collapse="isCollapsed"
               text-color="white"
               active-text-color="var(--theme-golden)"
               background-color="#001529"
               style="height: 100%">
        <el-menu-item style="margin: 30px 25px 30px 25px">
          <span class="logo">WordWide Links</span>
        </el-menu-item>
        <el-menu-item index="device-manage">
          <i class="el-icon-setting"></i>
          <span>设备管理</span>
        </el-menu-item>
        <el-submenu index="rule">
          <template slot="title">
            <i class="el-icon-place"></i>
            <span>规则引擎</span>
          </template>
          <el-menu-item index="rule-manage">规则管理</el-menu-item>
          <el-menu-item index="rule-edit">规则编辑</el-menu-item>
        </el-submenu>
        <el-menu-item index="simulator">
          <i class="el-icon-mobile"></i>
          <span>设备模拟</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-menu class="clear-fix"
                 @select="navigation"
                 mode="horizontal"
                 background-color="#ffffff"
                 text-color="#000000"
                 active-text-color="var(--theme-blue)">
          <el-menu-item>
            <el-button :icon="isCollapsed ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
                       @click="isCollapsed=!isCollapsed"/>
          </el-menu-item>
          <el-menu-item>
            <i>{{projectName}}</i>
          </el-menu-item>
          <el-submenu index="member" v-if="id" style="float: right">
            <template slot="title">{{ id }}</template>
            <el-menu-item index="member-logout">
              <i class="el-icon-remove-outline"></i>
              登出
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else index="member-login" style="float: right">
            <i class="el-icon-user"></i>
            登录
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <router-view id="main"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';

export default {
  name: 'DashBoard',
  data() {
    return {
      userid: sessionStorage.getItem('id'),
      projectName: sessionStorage.getItem('projectName'),
      isCollapsed: false
    }
  },
  mounted() {
    // TODO REMOVE
    sessionStorage.setItem('projectId', '1');
  },
  methods: {
    navigation(key) {
      switch (key) {
        case 'device-manage':
          this.$router.push('/');
          break;
        case 'rule-manage':
          this.$router.push('/dashboard/rule_manage');
          break;
        case 'rule-edit':
          this.$router.push('/dashboard/rule_edit');
          break;
        case 'simulator':
          this.$router.push('/dashboard/simulator');
          break;
        case 'member-login':
          this.$router.push('/');
          break;
        case 'member-logout':
          this.logout()
          break;
        default:
          break;
      }
    },
    logout() {

          sessionStorage.clear();
          this.$router.push('/');

    }
  }
};
</script>

<style scoped>
.logo {
  color: transparent;
  font-size: 25px;
  text-align: center;
  -webkit-text-stroke: 2px var(--theme-blue);
  letter-spacing: 0.04em;
}

#main {
  margin: 0 auto 0 auto;
  min-height: 80%;
}
</style>