<template>
  <div style="height: 100%;">
    <div style="padding-top: 8%; margin-left: 30%">
      <span class="title">创建或选择您的项目</span>
    </div>
    <div style="width: 800px; margin: 50px 30% auto 30%">
      <el-row gutter="10">
        <el-col :span="8" v-for="prj in projects" :key="prj">
          <div v-if="prj" @click="enter(prj)">
            <div>{{ prj }}</div>
            <img src="../assets/image/folder.png">
          </div>
          <div v-else @click="create" class="project project-create" style="margin-top: 18px">
            <i class="el-icon-plus plus-icon"></i>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Project",
  data() {
    return {
      projects: ['test1', 'test2', 'tes3', 'test4', 'test5', null]
    }
  },
  methods: {
    enter: function (projectId) {
      alert(projectId)
    },
    create: function () {
      alert('test')
    }
  }
}
</script>

<style scoped>
.title {
  color: transparent;
  font-family: "黑体";
  font-size: 20px;
  -webkit-text-stroke: 1px var(--theme-blue);
  letter-spacing: 0.04em;
}

.project {
  width: 130px;
  height: 130px;
  line-height: 130px;
}

.project-create {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}

.plus-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 139px;
  line-height: 130px;
  text-align: center;
}

.project-create:hover {
  border-color: var(--theme-blue);
}
</style>