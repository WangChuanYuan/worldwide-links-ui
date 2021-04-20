<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>规则编辑</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/rule_manage'}">规则引擎</el-breadcrumb-item>
        <el-breadcrumb-item>规则编辑</el-breadcrumb-item>
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

        <!--生效时间-->
        <el-row>
          <el-form-item prop="dates" label="生效时间">
            <el-col :span="6">
              <el-date-picker
                  v-model="ruleForm.dates"
                  type="datetimerange"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  range-separator="至"
                  start-placeholder="起始时间"
                  end-placeholder="结束时间"
                  placeholder="选择生效时间"
                  :default-time="['00:00:00', '23:59:59']">
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="2">
            <b>触发条件</b>
          </el-col>
          <el-col :span="2">
            <el-tooltip content="多个触发器仅需满足一个，触发器内条件需同时满足" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>

        <!--产品 设备-->
        <el-row style="padding-top: 15px">
          <el-col :span="6">
            <el-form-item prop="productId" label="产品">
              <el-select v-model="ruleForm.productId"
                         :value="ruleForm.productId"
                         @change="changeProduct($event)">
                <el-option
                    v-for="p in products"
                    :key="p.productId"
                    :label="p.productName"
                    :value="p.productId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item v-if="ruleForm.productId" prop="deviceId" label="设备">
              <el-select v-model="ruleForm.deviceId" :value="ruleForm.deviceId">
                <el-option
                    v-for="d in devices[ruleForm.productId]"
                    :key="d.deviceId"
                    :label="d.deviceName"
                    :value="d.deviceId">
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
                      :key="prop.identifier"
                      :label="prop.name"
                      :value="prop.identifier">
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
        <div style="background-color: var(--theme-grey); margin-top: 10px; padding-bottom: 8px"
             v-for="(action, actIdx) in ruleForm.actions" :key="'action' + actIdx">
          <el-row :gutter="5" style="margin-left: 8px; padding-top: 8px">
            <el-col :span="4">
              <el-select
                  v-model="action.name"
                  :value="action.name"
                  @change="changeAction($event, actIdx)">
                <el-option
                    v-for="act in actions"
                    :key="act.name"
                    :label="act.label"
                    :value="act.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" v-if="action.name === 'ctrlAction'">
              <el-form-item label="产品">
                <el-select v-model="action.productId"
                           :value="action.productId"
                           @change="changeProduct($event)">
                  <el-option
                      v-for="p in products"
                      :key="p.productId"
                      :label="p.productName"
                      :value="p.productId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item v-if="action.productId" label="设备">
                <el-select v-model="action.deviceId" :value="action.deviceId">
                  <el-option
                      v-for="d in devices[action.productId]"
                      :key="d.deviceId"
                      :label="d.deviceName"
                      :value="d.deviceId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button type="text" @click="deleteAction(actIdx)">删除</el-button>
            </el-col>
          </el-row>
          <!--action params-->
          <div v-if="action.name === 'ctrlAction'">
            <el-row :gutter="5" style="margin-left: 8px; padding-top: 10px">
              <el-col :span="4">
                <el-form-item label="服务" v-if="action.productId">
                  <el-select v-model="action.method"
                             :value="action.method"
                             @change="changeServe($event, actIdx)">
                    <el-option
                        v-for="serve in serves[action.productId]"
                        :key="serve.identifier"
                        :label="serve.name"
                        :value="serve.identifier">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="5" style="margin-left: 8px; padding-top: 10px"
                    v-for="(param, pIdx) in action.params" :key="pIdx">
              <el-col :span="4">
                <el-form-item>
                  <el-input disabled v-model="param.property"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item>
                  <el-input v-model="param.value" placeholder="值"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-else>
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
                  <el-input v-model="param.value" placeholder="值"></el-input>
                </el-form-item>
              </el-col>
<!--              <el-col :span="4" :offset="2">-->
<!--                <el-button type="text" @click="deleteParam(actIdx, pIdx)">删除</el-button>-->
<!--              </el-col>-->
            </el-row>
<!--            <el-row style="margin-left: 10px">-->
<!--              <el-button type="text" @click="addParam(actIdx)">添加</el-button>-->
<!--            </el-row>-->
          </div>

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
  name: 'RuleEditor',
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
    Api.get('/device-service/product/getAll',
        {projectId: Number(sessionStorage.getItem('projectId'))})
        .then((data) => {
          if (data) {
            this.products = data;
            for (let i = 0; i < this.products.length; i++) {
              let productId = this.products[i].productId;
              this.properties[productId] = this.products[i].modelPro;
              this.serves[productId] = this.products[i].modelServe;
              this.serveParam[productId] = {};
              for (let j = 0; j < this.products[i].modelServe.length; j++) {
                this.serveParam[productId][this.products[i].modelServe[j].identifier]
                    = this.products[i].modelServe[j].params
              }
            }
          }
        }).catch(() => {});

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
              if (key === 'productId') {
                action['productId'] = data.actions[i].params['productId'];
              }
              else if (key === 'deviceId') {
                action['deviceId'] = data.actions[i].params['deviceId'];
              }
              else if (key === 'method') {
                action['method'] = data.actions[i].params['method'];
              }
              else action['params'].push({'property': key, 'value': data.actions[i].params[key]});
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
        {productId: 1, productName: '温度传感器'}
      ],
      devices: {
        1: [{deviceId: 1, deviceName: '水温计'}, {deviceId: 2, deviceName: '体温仪'}]
      },
      properties: {
        1: [{identifier: 'temperature', name: '温度'}, {identifier: 'power', name: '电量'}]
      },
      serves: {
        1: [{identifier: 'control', name: '控制',
              params: [{identifier: 'temperature', name: '温度'}, {identifier: 'power', name: '电量'}]}]
      },
      serveParam: {
        1 : {
          'control': [{identifier: 'temperature', name: '温度'}, {identifier: 'power', name: '电量'}]
        }
      },

      operators: ['==', '!=', '>', '<', '>=', '<='],
      actions: [{name: 'mailAction', label: '邮件通知'}, {name: 'ctrlAction', label: '控制设备'}],

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
      this.ruleForm.actions.push({name: '', params: []});
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

    changeProduct(productId) {
      console.log('/device-service/device/getDeviceByProduct/' + productId);
      Api.get('/device-service/device/getDeviceByProduct/' + productId)
          .then((data) => {
            if (data) {
              this.devices[productId] = data;
            }
          }).catch(() => {});
    },
    changeAction(actionName, actIdx) {
      this.ruleForm.actions[actIdx].params = [];
      if (actionName === 'ctrlAction') {
        // 默认控制本设备
        if (this.ruleForm.productId)
          this.ruleForm.actions[actIdx].productId = Number(this.ruleForm.productId);
        if (this.ruleForm.deviceId)
          this.ruleForm.actions[actIdx].deviceId = Number(this.ruleForm.deviceId);
      } else {
        this.ruleForm.actions[actIdx].productId = null;
        this.ruleForm.actions[actIdx].deviceId = null;
        this.ruleForm.actions[actIdx].params.push({property: 'email', value: ''});
      }
    },
    changeServe(serveIdentifier, actIdx) {
      this.ruleForm.actions[actIdx].params = [];
      let productId = this.ruleForm.actions[actIdx].productId;
      for (let i = 0; i < this.serveParam[productId][serveIdentifier].length; i++) {
        let p = this.serveParam[productId][serveIdentifier][i].identifier;
        this.ruleForm.actions[actIdx].params.push({property: p, value: ''});
      }
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
            if (this.ruleForm.actions[i].productId) {
              paramMap['productId'] = Number(this.ruleForm.actions[i].productId);
            }
            if (this.ruleForm.actions[i].deviceId) {
              paramMap['deviceId'] = Number(this.ruleForm.actions[i].deviceId);
            }
            if (this.ruleForm.actions[i].method) {
              paramMap['method'] = this.ruleForm.actions[i].method;
            }
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