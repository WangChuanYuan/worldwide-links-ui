<template>
  <div style="height: 100%;">
    <div style="padding-top: 8%; margin-left: 30%">
      <span class="title">创建或选择进入您的项目</span>
    </div>
    <div style="width: 800px; margin: 50px 30% auto 30%">
      <el-row :gutter="10">
        <el-col :span="8" v-for="prj in projects" :key="prj.projectId">
          <div v-if="prj.projectId>=0">
            <div>{{ prj.name }}<el-button type="text" style="margin-left: 10px" @click="removePrj(prj.projectId)">删除</el-button></div>
            <img src="../assets/image/folder.png" @click="enter(prj)">
          </div>
          <div v-else @click="dialogVisible=true" class="project project-create" style="margin-top: 18px">
            <i class="el-icon-plus plus-icon"></i>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog
        title="新建项目"
        :visible.sync="dialogVisible"
        width="30%">
      <el-input v-model="projectName" placeholer="项目名称"></el-input>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="create(projectName)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Api from '../assets/js/api';

export default {
  name: "Project",
  data() {
    return {
      dialogVisible: false,
      projectName: '',
      projects: [{name: 'project', userId: 'test',projectId:'0'}]
    }
  },
  mounted(){
    let url='/user-service/project/getUserProject?userId='+sessionStorage.getItem('userId')
    Api.get(url,{}).then((data)=>{
      this.projects=[];
      for (let i=0;i<data.length;i++){
        this.projects.push(data[i])
      }
      this.projects.push({name:null,userId:null,projectId:-1});
    }).catch();
  },
  methods: {

    enter: function (project) {
      sessionStorage.setItem('projectId', project.projectId);
      sessionStorage.setItem('projectName', project.name);
      this.$router.push('/dashboard');
    },
    removePrj: function (prjId){
      if(prjId>=0){
        let url='/user-service/project/delete?projectId='+prjId;
        Api.delete(url,{}).then((data)=>{
          if(data===true){
            this.$message.success("删除成功！");
            location.reload();
          }else {
            this.$message.warning("删除失败！");
          }
        })
      }
    },
    create: function (name) {

        if (name.length>0) {
          let url='/user-service/project/create?name='+name+'&userId='+sessionStorage.getItem('userId')
          Api.post(url, {
          }).then((data) => {
            if (data.result=== "success") {
/*              if (sessionStorage.getItem('id') !== data.userId) {
                sessionStorage.setItem('id', data.userId);
              }
              if(sessionStorage.getItem('projectId')!==data.projectId){
                sessionStorage.setItem('projectId', data.projectId);
              }
              if(sessionStorage.getItem('projectName')!==data.projectName){
                sessionStorage.setItem('projectName', data.projectName);
              }*/
              location.reload();
            } else {
              this.$message.warning('创建失败！');
            }
          });
        }

      this.dialogVisible = false;
    }
  }
}
</script>

<style scoped>
.title {
  color: transparent;
  font-family: "黑体", serif;
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