<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>物模型创建</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/device_manage'}">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>物模型创建</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="modelForm" :rules="ruleRules" ref="modelForm" style="padding-left: 2%">

        <!--名称 描述-->
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item prop="name" label="名称">
              <el-input v-model="modelForm.name" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item prop="identifier" label="标识符">
              <el-input v-model="modelForm.identifier" placeholder="标识符"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="description" label="描述">
              <el-input v-model="modelForm.description" placeholder="描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="2">
            <b>数据类型</b>
          </el-col>
          <el-col :span="2">
            <el-tooltip content="暂无" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>

        <!--类型 读写-->
        <el-row style="padding-top: 15px">
          <el-col :span="6">
            <el-form-item prop="modelType" label="物模型类型">
              <el-select v-model="modelForm.modelType" :value="modelForm.modelType">
                <el-option
                    v-for="p in modelType"
                    :key="p.id"
                    :label="p.name"
                    :value="p.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item  v-if="modelForm.modelType" prop="dataType" label="数据类型">
              <el-select v-model="modelForm.dataType" :value="modelForm.dataType">
                <el-option
                    v-for="p in dateType"
                    :key="p.id"
                    :label="p.name"
                    :value="p.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-if="modelForm.dataType" prop="deviceId" label="读写权限">
              <el-select v-model="modelForm.accessMode" :value="modelForm.accessMode">
                <el-option
                    v-for="d in accessMode"
                    :key="d.id"
                    :label="d.name"
                    :value="d.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>



        <el-row>
          <el-col :span="4">
            <b>是否启动</b>
            <el-switch
                v-model="modelForm.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="margin: 5px 10px">
            </el-switch>
          </el-col>
        </el-row>

        <!--保存 重置-->
        <el-row>
          <el-col :span="6" :offset="4">
            <el-button type="primary" @click="submit('modelForm')">保存</el-button>
            <el-button type="plain" @click="reset('modelForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';

export default {
  name: 'DeviceModelPro',
  props: {
    'rid': {
      type: Number,
      default: 0
    },
    'aim': {
      // add || modify
      type: String,
      default: 'add'
    },
    'modelPro': {
      type: Object,
      default: null
    }
  },
  mounted() {

    console.log(sessionStorage.getItem('projectId'));
    if (this.aim === 'modify') {
      let url = '/rule-service/' + sessionStorage.getItem('projectId') + '/rules/' + this.rid;
      let _this = this;
      Api.get(url).then((data) => {
        if (data) {
          _this.modelForm.name = data.name;
          _this.modelForm.description = data.description;
          _this.modelForm.productId = data.productId;
          _this.modelForm.deviceId = data.deviceId;

          let dates = [];
          dates[0] = data.begin;
          dates[1] = data.end;
          _this.modelForm.dates = dates;
          _this.modelForm.accessMode = data.accessMode;

          _this.modelForm.triggers = data.triggers;
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
          _this.modelForm.actions = actions_;
        }
      }).catch(() => {
      });
    }
  },
  data() {
    return {
      modelType: [
        {id: 1, name: 'modelPro'}, {id: 2, name: 'modelServe'},{id: 3, name: 'modelEvent'}
      ],
      dateType: [
        {id: 1, name: 'int'}, {id: 2, name: 'double'}, {id: 3, name: 'string'}, {id: 4, name: 'Long'}
      ],
      accessMode: [
        {id: 1, name: '只读'},{id: 2, name: '只写'},{id: 3, name: '允许读写'}
      ],
      properties: {
        1: [{name: 'temperature'}]
      },
      operators: ['==', '!=', '>', '<', '>=', '<='],
      actions: [{name: 'mailAction', label: '邮件通知'}, {name: 'cmdAction', label: '控制设备'}],
      /** form */
      // modelForm: {
      //   modelType:'',
      //   identifier:'',
      //   name: '',
      //   description: '',
      //   dates: [],
      //   dataType: null,
      //   deviceId: null,
      //   triggers: [],
      //   actions: [],
      //   enabled: true,
      //   accessMode:'',
      // },
      modelForm: this.modelPro,
      ruleRules: {
        name: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        identifier: [
          {
            required: true,
            message: '请输入标识符名称',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: false,
            message: '请输入规则描述',
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
        productId: [
          {
            required: true,
            message: '请选择产品',
            trigger: 'blur'
          }
        ],
        deviceId: [
          {
            required: false,
            message: '请选择设备',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    addTrigger() {
      this.modelForm.triggers.push({conditions: []});
    },
    deleteTrigger(trigIdx) {
      this.modelForm.triggers.splice(trigIdx, 1);
    },
    addCondition(trigIdx) {
      this.modelForm.triggers[trigIdx].conditions.push({property: '', operator: '', value: ''});
    },
    deleteCondition(trigIdx, condIdx) {
      this.modelForm.triggers[trigIdx].conditions.splice(condIdx, 1);
    },

    addAction() {
      this.modelForm.actions.push({name: 'mailAction', params: []});
    },
    deleteAction(actIdx) {
      this.modelForm.actions.splice(actIdx, 1);
    },
    addParam(actIdx) {
      this.modelForm.actions[actIdx].params.push({property: '', value: ''});
    },
    deleteParam(actIdx, pIdx) {
      this.modelForm.actions[actIdx].params.splice(pIdx, 1);
    },

    reset(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          for (let i = 0; i < this.modelForm.triggers.length; i++) {
            this.modelForm.triggers[i].conditions.forEach(condition => {
              if (!isNaN(condition.value)) condition.value = Number(condition.value);
            });
          }
          let actions_ = []
          for (let i = 0; i < this.modelForm.actions.length; i++) {
            actions_.push({name: this.modelForm.actions[i].name, params: {}});
            let paramMap = {}
            this.modelForm.actions[i].params.forEach(param => {
              if (!isNaN(param.value)) param.value = Number(param.value);
              paramMap[param.property] = param.value;
            });
            actions_[i].params = paramMap
          }
          let model = {};
          model['name'] = this.modelForm.name;
          model['description'] = this.modelForm.description;
          model['projectId'] = sessionStorage.getItem('projectId');
          model['productId'] = this.modelForm.productId;
          model['identifier'] = this.modelForm.identifier;
          model['dataType'] = this.modelForm.dataType;
          model['accessMode'] = this.modelForm.accessMode;
          let url = '/device-service/' + this.modelForm.modelType + '/create';
          if (this.aim === 'modify') {
            model['id'] =  this.rid;
            Api.put(url, model).then((data) => {
              if (data) {
                this.$message.success("修改规则成功");
                this.$router.push('/dashboard/rule_manage');
              } else this.$message.warning("修改规则失败");
            }).catch(() => {
            });
          } else {
            Api.post(url, model).then((data) => {
              if (data) {
                this.$message.success("新建物模型成功");
                this.$emit('close');
                // this.$router.push('/dashboard/product_manage');
              } else this.$message.warning("新建物模型失败");
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