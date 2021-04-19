<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>设备创建</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/device_manange'}">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备创建</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="deviceForm" :rules="ruleRules" ref="deviceForm" style="padding-left: 2%">

        <!--名称 描述-->
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item prop="name" label="名称">
              <el-input v-model="deviceForm.name" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="description" label="描述">
              <el-input v-model="deviceForm.description" placeholder="描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="industry" label="所属工厂">
              <el-input v-model="deviceForm.industry" placeholder="所属工厂"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="password" label="密码">
              <el-input  v-model="deviceForm.password" placeholder="密码" show-password></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <el-col :span="2">
            <b>物模型</b>
          </el-col>
          <el-col :span="2">
            <el-tooltip content="物模型选择" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>

        <!--产品 设备-->
        <el-row style="padding-top: 15px">
          <el-col :span="6">
            <el-form-item prop="modelProId" label="物模型-属性">
              <el-select v-model="deviceForm.modelProId" :value="deviceForm.modelProId">
                <el-option
                    v-for="p in modelPros"
                    :key="p.id"
                    :label="p.name"
                    :value="p.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-if="deviceForm.modelProId" prop="modelServeId" label="物模型-服务">
              <el-select v-model="deviceForm.modelServeId" :value="deviceForm.modelServeId">
                <el-option
                    v-for="d in modelServes"
                    :key="d.id"
                    :label="d.name"
                    :value="d.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--保存 重置-->
        <el-row>
          <el-col :span="6" :offset="4">
            <el-button type="primary" @click="submit('deviceForm')">创建</el-button>
            <el-button type="plain" @click="reset('deviceForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';

export default {
  name: 'DeviceCreate',
  props: {
    'rid': {
      type: Number,
      default: 0
    },
    'aim': {
      // add || modify
      type: String,
      default: 'add'
    }
  },
  mounted() {
    let url = '/device-service/modelPro/getAll'
    Api.get(url).then((data) => {
      if (data) this.modelPros = data;
    }).catch(() => {
    });
    url = '/device-service/modelServe/getAll'
    Api.get(url).then((data) => {
      if (data) this.modelServes = data;
    }).catch(() => {
    });
    console.log(sessionStorage.getItem('projectId'));
    if (this.aim === 'modify') {
      let url = '/device-service/' + sessionStorage.getItem('projectId') + '/rules/' + this.rid;
      let _this = this;
      Api.get(url).then((data) => {
        if (data) {
          _this.deviceForm.name = data.name;
          _this.deviceForm.description = data.description;
          _this.deviceForm.modelProId = data.modelProId;
          _this.deviceForm.modelServeId = data.modelServeId;

          let dates = [];
          dates[0] = data.begin;
          dates[1] = data.end;
          _this.deviceForm.dates = dates;
          _this.deviceForm.enabled = data.enabled;

          _this.deviceForm.triggers = data.triggers;
          let actions_ = [];
          for (let i = 0; i < data.actions.length; i++) {
            let action = {};
            action['name'] = data.actions[i].name;
            action['params'] = [];
            for (let key in data.actions[i].params) {
              action['params'].push({'property': key, 'value': data.actions[i].params[key]});
            }
            actions_.push(action);
          }
          _this.deviceForm.actions = actions_;
        }
      }).catch(() => {
      });
    }
  },
  data() {
    return {
      modelPros: [],
      modelServes: [],
      properties: {
        1: [{name: 'temperature'}]
      },
      operators: ['==', '!=', '>', '<', '>=', '<='],
      actions: [{name: 'mailAction', label: '邮件通知'}, {name: 'cmdAction', label: '控制设备'}],
      /** form */
      deviceForm: {
        name: '',
        description: '',
        industry:'',
        password:'',
        dates: [],
        modelProId: null,
        modelServeId: null,
        triggers: [],
        actions: [],
        enabled: true
      },
      ruleRules: {
        name: [
          {
            required: true,
            message: '请输入设备名称',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: false,
            message: '请输入设备描述',
            trigger: 'blur'
          }
        ],
        dates: [
          {
            required:false,
            message: '请选择生效时间',
            trigger: 'blur'
          }
        ],
        modelProId: [
          {
            required: true,
            message: '请选择属性',
            trigger: 'blur'
          }
        ],
        modelServeId: [
          {
            required: false,
            message: '请选择服务',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    addTrigger() {
      this.deviceForm.triggers.push({conditions: []});
    },
    deleteTrigger(trigIdx) {
      this.deviceForm.triggers.splice(trigIdx, 1);
    },
    addCondition(trigIdx) {
      this.deviceForm.triggers[trigIdx].conditions.push({property: '', operator: '', value: ''});
    },
    deleteCondition(trigIdx, condIdx) {
      this.deviceForm.triggers[trigIdx].conditions.splice(condIdx, 1);
    },

    addAction() {
      this.deviceForm.actions.push({name: 'mailAction', params: []});
    },
    deleteAction(actIdx) {
      this.deviceForm.actions.splice(actIdx, 1);
    },
    addParam(actIdx) {
      this.deviceForm.actions[actIdx].params.push({property: '', value: ''});
    },
    deleteParam(actIdx, pIdx) {
      this.deviceForm.actions[actIdx].params.splice(pIdx, 1);
    },

    reset(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          for (let i = 0; i < this.deviceForm.triggers.length; i++) {
            this.deviceForm.triggers[i].conditions.forEach(condition => {
              if (!isNaN(condition.value)) condition.value = Number(condition.value);
            });
          }
          let actions_ = []
          for (let i = 0; i < this.deviceForm.actions.length; i++) {
            actions_.push({name: this.deviceForm.actions[i].name, params: {}});
            let paramMap = {}
            this.deviceForm.actions[i].params.forEach(param => {
              if (!isNaN(param.value)) param.value = Number(param.value);
              paramMap[param.property] = param.value;
            });
            actions_[i].params = paramMap
          }
          let device = {};
          device['deviceName'] = this.deviceForm.name;
          device['description'] = this.deviceForm.description;
          device['projectId'] = sessionStorage.getItem('projectId');
          device['industry'] = this.deviceForm.industry;
          device['deviceState']='下线';
          device['logo']='';
          device['location']='';
          device['username']=sessionStorage.getItem("userId");
          device['password']=this.deviceForm.password;
          let url = '/device-service/device/create/'+sessionStorage.getItem('projectId') ;
          if (this.aim === 'modify') {
            device['id'] =  this.rid;
            Api.put(url, device).then((data) => {
              if (data) {
                this.$message.success("修改设备成功");
                this.$router.push('/dashboard/device_manage');
              } else this.$message.warning("修改设备失败");
            }).catch(() => {
            });
          } else {
            Api.post(url, device).then((data) => {
              if (data) {
                this.$message.success("新建设备成功");
                this.$router.push('/dashboard/device_manage');
              } else this.$message.warning("新建设备失败");
            }).catch(() => {
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>

</style>