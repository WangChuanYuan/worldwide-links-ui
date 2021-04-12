<template>
  <div title="404" style="text-align: center">
    <p>Sorry, the page you visited does not exist.</p>
    <el-button type="primary" size="small" @click="toHome">
      Back Home
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'Exception404',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>