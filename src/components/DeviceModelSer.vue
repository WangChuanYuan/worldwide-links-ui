<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>物模型</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/device_manage'}">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>物模型-服务</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="ruleForm" :rules="ruleRules" ref="ruleForm" style="padding-left: 2%">

        <!--名称 描述-->
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item prop="name" label="名称">
              <el-input v-model="ruleForm.name" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="description" label="描述">
              <el-input v-model="ruleForm.description" placeholder="描述"></el-input>
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
            <el-form-item prop="productId" label="数据类型">
              <el-select v-model="ruleForm.productId" :value="ruleForm.productId">
                <el-option
                    v-for="p in products"
                    :key="p.id"
                    :label="p.name"
                    :value="p.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-if="ruleForm.productId" prop="deviceId" label="读写权限">
              <el-select v-model="ruleForm.deviceId" :value="ruleForm.deviceId">
                <el-option
                    v-for="d in devices[ruleForm.productId]"
                    :key="d.id"
                    :label="d.name"
                    :value="d.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!--触发器-->
        <div style="background-color: var(--theme-grey); margin-top: 10px"
             v-for="(trigger, trigIdx) in ruleForm.triggers" :key="trigIdx">
          <el-row>
            <el-col :span="2" style="font-size: 15px; padding: 5px 0 0 10px">
              触发器{{trigIdx}}
            </el-col>
            <el-col :span="1">
              <el-button type="text" @click="deleteTrigger(trigIdx)">删除</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="5" style="margin-left: 8px; padding-top: 15px"
                  v-for="(condition, condIdx) in trigger.conditions" :key="condIdx">
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="condition.property" :value="condition.property" placeholder="过滤条件">
                  <el-option
                      v-for="prop in properties[ruleForm.productId]"
                      :key="prop.name"
                      :label="prop.name"
                      :value="prop.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="condition.operator" :value="condition.operator" placeholder="操作符">
                  <el-option
                      v-for="op in operators"
                      :key="op"
                      :label="op"
                      :value="op">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="condition.value" placeholder="过滤条件值"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" :offset="2">
              <el-button type="text" @click="deleteCondition(trigIdx, condIdx)">删除</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-left: 10px">
            <el-button type="text" @click="addCondition(trigIdx)">添加</el-button>
          </el-row>
        </div>
        <el-row style="margin-left: 10px">
          <el-button type="text" icon="el-icon-plus" @click="addTrigger">新增触发器</el-button>
        </el-row>

        <!--执行动作-->
        <el-row>
          <b>执行动作</b>
        </el-row>
        <div style="background-color: var(--theme-grey); margin-top: 10px"
             v-for="(action, actIdx) in ruleForm.actions" :key="'action' + actIdx">
          <el-row :gutter="5" style="margin-left: 8px; padding-top: 10px">
            <el-col :span="4">
              <el-select v-model="action.name" :value="action.name">
                <el-option
                    v-for="act in actions"
                    :key="act.name"
                    :label="act.label"
                    :value="act.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="text" @click="deleteAction(actIdx)">删除</el-button>
            </el-col>
          </el-row>
          <!--action params-->
          <el-row :gutter="5" style="margin-left: 8px; padding-top: 10px"
                  v-for="(param, pIdx) in action.params" :key="pIdx">
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="param.property" :value="param.property">
                  <el-option
                      v-for="prop in (action.name === 'mailAction' ? [{name: 'email'}] : properties[ruleForm.productId])"
                      :key="prop.name"
                      :label="prop.name"
                      :value="prop.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-input v-model="param.value" placeholder="名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4" :offset="2">
              <el-button type="text" @click="deleteParam(actIdx, pIdx)">删除</el-button>
            </el-col>
          </el-row>
          <el-row style="margin-left: 10px">
            <el-button type="text" @click="addParam(actIdx)">添加</el-button>
          </el-row>
        </div>
        <el-row style="margin-left: 10px">
          <el-button type="text" icon="el-icon-plus" @click="addAction">新增执行动作</el-button>
        </el-row>

        <el-row>
          <el-col :span="4">
            <b>是否启动</b>
            <el-switch
                v-model="ruleForm.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="margin: 5px 10px">
            </el-switch>
          </el-col>
        </el-row>

        <!--保存 重置-->
        <el-row>
          <el-col :span="6" :offset="4">
            <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
            <el-button type="plain" @click="reset('ruleForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';

export default {
  name: 'DeviceModelSer',
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
    // Api.get('/get_categories', {restaurant: sessionStorage.getItem('id')}).then((data) => {
    //   if (data) {
    //     this.products = [];
    //   }
    // }).catch(() => {
    // });
    console.log(sessionStorage.getItem('projectId'));
    if (this.aim === 'modify') {
      let url = '/rule-service/' + sessionStorage.getItem('projectId') + '/rules/' + this.rid;
      let _this = this;
      Api.get(url).then((data) => {
        if (data) {
          _this.ruleForm.name = data.name;
          _this.ruleForm.description = data.description;
          _this.ruleForm.productId = data.productId;
          _this.ruleForm.deviceId = data.deviceId;

          let dates = [];
          dates[0] = data.begin;
          dates[1] = data.end;
          _this.ruleForm.dates = dates;
          _this.ruleForm.enabled = data.enabled;

          _this.ruleForm.triggers = data.triggers;
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
          _this.ruleForm.actions = actions_;
        }
      }).catch(() => {
      });
    }
  },
  data() {
    return {
      products: [
        {id: 1, name: 'int'}, {id: 2, name: 'double'}, {id: 3, name: 'string'}, {id: 4, name: 'Long'}
      ],
      devices: {
        1: [{id: 1, name: '只读'},{id: 2, name: '只写'},{id: 3, name: '允许读写'}]
      },
      properties: {
        1: [{name: 'temperature'}]
      },
      operators: ['==', '!=', '>', '<', '>=', '<='],
      actions: [{name: 'mailAction', label: '邮件通知'}, {name: 'cmdAction', label: '控制设备'}],
      /** form */
      ruleForm: {
        name: '',
        description: '',
        dates: [],
        productId: null,
        deviceId: null,
        triggers: [],
        actions: [],
        enabled: true
      },
      ruleRules: {
        name: [
          {
            required: true,
            message: '请输入规则名称',
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
      this.ruleForm.triggers.push({conditions: []});
    },
    deleteTrigger(trigIdx) {
      this.ruleForm.triggers.splice(trigIdx, 1);
    },
    addCondition(trigIdx) {
      this.ruleForm.triggers[trigIdx].conditions.push({property: '', operator: '', value: ''});
    },
    deleteCondition(trigIdx, condIdx) {
      this.ruleForm.triggers[trigIdx].conditions.splice(condIdx, 1);
    },

    addAction() {
      this.ruleForm.actions.push({name: 'mailAction', params: []});
    },
    deleteAction(actIdx) {
      this.ruleForm.actions.splice(actIdx, 1);
    },
    addParam(actIdx) {
      this.ruleForm.actions[actIdx].params.push({property: '', value: ''});
    },
    deleteParam(actIdx, pIdx) {
      this.ruleForm.actions[actIdx].params.splice(pIdx, 1);
    },

    reset(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // for (let i  = 0; i < this.ruleForm.triggers.length; i++) {
          //   if (this.ruleForm.deviceId) {
          //     this.ruleForm.triggers[i].splice(0, 0,
          //         {property: 'deviceId', operator: '==', value: this.ruleForm.deviceId});
          //   }
          //   if (this.ruleForm.productId) {
          //     this.ruleForm.triggers[i].splice(0, 0,
          //         {property: 'productId', operator: '==', value: this.ruleForm.productId});
          //   }
          // }
          for (let i = 0; i < this.ruleForm.triggers.length; i++) {
            this.ruleForm.triggers[i].conditions.forEach(condition => {
              if (!isNaN(condition.value)) condition.value = Number(condition.value);
            });
          }
          let actions_ = []
          for (let i = 0; i < this.ruleForm.actions.length; i++) {
            actions_.push({name: this.ruleForm.actions[i].name, params: {}});
            let paramMap = {}
            this.ruleForm.actions[i].params.forEach(param => {
              if (!isNaN(param.value)) param.value = Number(param.value);
              paramMap[param.property] = param.value;
            });
            actions_[i].params = paramMap
          }
          let rule = {};
          rule['name'] = this.ruleForm.name;
          rule['description'] = this.ruleForm.description;
          rule['projectId'] = sessionStorage.getItem('projectId');
          rule['productId'] = this.ruleForm.productId;
          rule['deviceId'] = this.ruleForm.deviceId;
          rule['triggers'] = this.ruleForm.triggers;
          rule['actions'] =  actions_
          rule['begin'] =  this.ruleForm.dates[0];
          rule['end'] = this.ruleForm.dates[1];
          rule['enabled'] = this.ruleForm.enabled;
          let url = '/rule-service/' + sessionStorage.getItem('projectId') + '/rules';
          if (this.aim === 'modify') {
            rule['id'] =  this.rid;
            Api.put(url, rule).then((data) => {
              if (data) {
                this.$message.success("修改规则成功");
                this.$router.push('/dashboard/rule_manage');
              } else this.$message.warning("修改规则失败");
            }).catch(() => {
            });
          } else {
            Api.post(url, rule).then((data) => {
              if (data) {
                this.$message.success("新建规则成功");
                this.$router.push('/dashboard/rule_manage');
              } else this.$message.warning("新建规则失败");
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