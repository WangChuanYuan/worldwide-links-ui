<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>产品创建</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/device_manange'}">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品创建</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="productForm" :rules="ruleRules" ref="deviceForm" style="padding-left: 2%">

        <!--名称 描述-->
        <el-row :gutter="10">
          <el-col :span="4">
            <el-form-item prop="name" label="名称">
              <el-input v-model="productForm.name" placeholder="名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="description" label="描述">
              <el-input v-model="productForm.description" placeholder="描述"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

<!--        &lt;!&ndash;产品 设备&ndash;&gt;-->
<!--        <el-row style="padding-top: 15px">-->
<!--          <el-col :span="6">-->
<!--            <el-form-item prop="modelProId" label="物模型-属性">-->
<!--              <el-select v-model="productForm.modelProId" :value="productForm.modelProId">-->
<!--                <el-option-->
<!--                    v-for="p in modelPros"-->
<!--                    :key="p.id"-->
<!--                    :label="p.name"-->
<!--                    :value="p.id">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <el-form-item v-if="productForm.modelProId" prop="modelServeId" label="物模型-服务">-->
<!--              <el-select v-model="productForm.modelServeId" :value="productForm.modelServeId">-->
<!--                <el-option-->
<!--                    v-for="d in modelServes"-->
<!--                    :key="d.id"-->
<!--                    :label="d.name"-->
<!--                    :value="d.id">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--        </el-row>-->



        <!--执行动作-->

        <el-row>
          <el-col :span="2">
            <b>物模型属性</b>
          </el-col>
          <el-col :span="2">
            <el-tooltip content="物模型属性" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <div style="background-color: var(--theme-grey); margin-top: 10px"
             v-for="(modelPro, modelProIdx) in productForm.modelPro" :key="modelProIdx">
          <el-row :gutter="5" style="margin-left: 8px; padding-top: 10px">
            <el-col :span="4">
              <el-select v-model="modelPro.name" :value="modelPro.name">
                <el-option
                    v-for="modelPro in modelPros"
                    :key="modelPro.id"
                    :label="modelPro.name"
                    :value="modelPro.name">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="text" @click="deleteAction(actIdx)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row style="margin-left: 10px">
          <el-button type="text" icon="el-icon-plus" @click="addModelPro">新增物模型属性</el-button>
        </el-row>



        <el-row>
          <el-col :span="4">
            <b>是否启动</b>
            <el-switch
                v-model="productForm.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                style="margin: 5px 10px">
            </el-switch>
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
    <el-dialog title="物模型属性" :visible.sync="modelProVisible">
      <DeviceModelPro :model-pro="modelPro2Edit"></DeviceModelPro>
    </el-dialog>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';
import DeviceModelPro from "@/components/DeviceModePro";

export default {
  name: 'ProductCreate',
  components: {DeviceModelPro},
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
      modelProVisible: false,
      modelPro2Edit: {},

      modelProsStore:[],
      modelPros: [],
      modelServes:[] ,
      /** form */
      productForm: {
        name: '',
        description: '',
        dates: [],
        modelPro: [],
        modelServe: [],
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
        // modelProId: [
        //   {
        //     required: true,
        //     message: '请选择属性',
        //     trigger: 'blur'
        //   }
        // ],
        // modelServeId: [
        //   {
        //     required: false,
        //     message: '请选择服务',
        //     trigger: 'blur'
        //   }
        // ]
      }
    };
  },
  methods: {
    closeproeditor() {
      this.modelProVisible = false;
    },
    addModelPro() {
      let tmp = {
        modelType:'',
        identifier:'',
        name: '',
        description: '',
        dates: [],
        dataType: null,
        deviceId: null,
        triggers: [],
        actions: [],
        enabled: true,
        accessMode:'',
      }
      this.productForm.modelPro.push(tmp);
      this.modelProVisible = true;
      this.modelPro2Edit = tmp;
    },
    deleteModelPro(proIdx) {
      this.productForm.modelPro.splice(proIdx, 1);
    },
    addCondition(trigIdx) {
      this.productForm.triggers[trigIdx].conditions.push({property: '', operator: '', value: ''});
    },
    deleteCondition(trigIdx, condIdx) {
      this.productForm.triggers[trigIdx].conditions.splice(condIdx, 1);
    },

    addAction() {
      this.productForm.actions.push({name: 'mailAction', params: []});
    },
    deleteAction(actIdx) {
      this.productForm.actions.splice(actIdx, 1);
    },
    addParam(actIdx) {
      this.productForm.actions[actIdx].params.push({property: '', value: ''});
    },
    deleteParam(actIdx, pIdx) {
      this.productForm.actions[actIdx].params.splice(pIdx, 1);
    },

    reset(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          for (let i = 0; i < this.productForm.triggers.length; i++) {
            this.productForm.triggers[i].conditions.forEach(condition => {
              if (!isNaN(condition.value)) condition.value = Number(condition.value);
            });
          }
          let actions_ = []
          for (let i = 0; i < this.productForm.actions.length; i++) {
            actions_.push({name: this.productForm.actions[i].name, params: {}});
            let paramMap = {}
            this.productForm.actions[i].params.forEach(param => {
              if (!isNaN(param.value)) param.value = Number(param.value);
              paramMap[param.property] = param.value;
            });
            actions_[i].params = paramMap
          }
          let product = {};
          product['productName'] = this.productForm.name;
          product['description'] = this.productForm.description;
          product['enabled'] = this.productForm.enabled;
          product['projectId'] = sessionStorage.getItem("projectId");
          let url = '/device-service/product/create';
          if (this.aim === 'modify') {
            product['productId'] =  this.rid;
            Api.put(url, product).then((data) => {
              if (data) {
                this.$message.success("修改设备成功");
                this.$router.push('/dashboard/device_manage');
              } else this.$message.warning("修改设备失败");
            }).catch(() => {
            });
          } else {
            Api.post(url, product).then((data) => {
              if (data) {
                this.$message.success("产品成功");
                this.$router.push('/dashboard/product_manage');
              } else this.$message.warning("新建产品失败");
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