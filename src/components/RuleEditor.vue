<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>规则编辑</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard'}">规则引擎</el-breadcrumb-item>
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
                  value-format="yyyy-MM-dd HH:mm"
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
          <b>触发条件</b>
        </el-row>

        <!--产品 设备-->
        <el-row style="padding-top: 15px">
          <el-col :span="6">
            <el-form-item prop="productId" label="产品">
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
            <el-form-item v-if="ruleForm.productId" prop="deviceId" label="设备">
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
             v-for="(trigger, trigIdx) in ruleForm.triggers" :key="trigger">
          <el-row>
            <el-col :span="2" style="font-size: 15px; padding: 5px 0 0 10px">
              触发器{{trigIdx}}
            </el-col>
            <el-col :span="1">
              <el-button type="text" @click="deleteTrigger(trigIdx)">删除</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="5" style="margin-left: 8px; padding-top: 15px"
                  v-for="(condition, condIdx) in trigger" :key="condition">
            <el-col :span="4">
              <el-form-item prop="condition.property">
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
              <el-form-item prop="condition.operator">
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
              <el-form-item prop="condition.value">
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
             v-for="(action, actIdx) in ruleForm.actions" :key="action">
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
                  v-for="(param, pIdx) in action.params" :key="param">
            <el-col :span="4">
              <el-form-item prop="param.property">
                <el-select v-model="param.property" :value="param.property">
                  <el-option
                      v-for="prop in action.name === 'emailAction' ? [{name: 'email'}] : properties[ruleForm.productId]"
                      :key="prop.name"
                      :label="prop.name"
                      :value="prop.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item prop="param.value">
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
    'id': {
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
    Api.get('/get_categories', {restaurant: sessionStorage.getItem('id')}).then((data) => {
      if (data) {
        this.products = data;
      }
    }).catch(() => {
    });
    if (this.aim === 'modify') {
      Api.get('/get_goods', {gid: this.gid}).then((data) => {
        if (data) {
          this.ruleForm.name = data.name;
          this.ruleForm.cgid = data.cgid;
          this.ruleForm.description = data.description;
          this.ruleForm.price = data.price;
          this.ruleForm.dailySupply = data.dailySupply;
          this.ruleForm.stock = data.stock;
          let dates = [];
          dates[0] = data.startDate;
          dates[1] = data.endDate;
          this.ruleForm.dates = dates;
        }
      }).catch(() => {
      });
    }
  },
  data() {
    return {
      products: [],
      devices: {},
      properties: {},
      operators: ['==', '!=', '>', '<', '>=', '<='],
      actions: [{name: 'emailAction', label: '邮件通知'}, {name: 'cmdAction', label: '控制设备'}],
      /** form */
      ruleForm: {
        name: '',
        description: '',
        dates: [],
        productId: undefined,
        deviceId: undefined,
        triggers: [],
        actions: []
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
      this.ruleForm.triggers.push([]);
    },
    deleteTrigger(trigIdx) {
      this.ruleForm.triggers.splice(trigIdx, 1);
    },
    addCondition(trigIdx) {
      this.ruleForm.triggers[trigIdx].push({condition: '', operator: '', value: ''});
    },
    deleteCondition(trigIdx, condIdx) {
      this.ruleForm.triggers[trigIdx].splice(condIdx, 1);
    },

    addAction() {
      this.ruleForm.actions.push({name: 'emailAction', params: []});
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
          let formData = new FormData();
          formData.append('name', this.ruleForm.name);
          formData.append('description', this.ruleForm.description);
          formData.append('category', this.ruleForm.cgid);
          formData.append('price', this.ruleForm.price);
          formData.append('stock', this.ruleForm.stock);
          formData.append('dailySupply', this.ruleForm.dailySupply);
          formData.append('startDate', this.ruleForm.dates[0]);
          formData.append('endDate', this.ruleForm.dates[1]);
          let url = '/add_goods';
          if (this.aim === 'add') {
            formData.append('restaurant', sessionStorage.getItem('id'));
          } else if (this.aim === 'modify') {
            url = '/modify_goods';
            formData.append('gid', this.gid);
          }
          Api.post(url, formData).then((data) => {
            if (data.code === "SUCCESS") {
              this.$message.success(data.msg);
              this.$router.push('/restaurantCenter/goods');
            } else this.$message.warning(data.msg);
          }).catch(() => {
          });
        }
      });
    }
  }
};
</script>

<style scoped>

</style>