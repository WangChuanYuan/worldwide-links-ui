<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>产品创建</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/device_manage'}">设备管理</el-breadcrumb-item>
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
            <el-col :span="12">
              <el-form :inline="true" label-position="left">
                <el-form-item label="名称" >
                  <el-input disabled v-model="modelPro.name"></el-input>
                </el-form-item>
                <el-form-item label="标识">
                  <el-input disabled v-model="modelPro.identifier"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="1">
              <el-button type="text" @click="modifyModelPro(modelPro)">修改</el-button>
            </el-col>
            <el-col :span="1">
              <el-button type="text" @click="deleteModelPro(modelProIdx)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row style="margin-left: 10px">
          <el-button type="text" icon="el-icon-plus" @click="addModelPro">新增物模型属性</el-button>
        </el-row>

        <el-row>
          <el-col :span="2">
            <b>物模型服务</b>
          </el-col>
          <el-col :span="2">
            <el-tooltip content="物模型服务" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>
        <div style="background-color: var(--theme-grey); margin-top: 10px"
             v-for="(modelServe, modelServeIdx) in productForm.modelServe" :key="'serve'+modelServeIdx">
          <el-row :gutter="5" style="margin-left: 8px; padding-top: 10px">
            <el-col :span="12">
              <el-form :inline="true" label-position="left">
                <el-form-item label="名称" >
                  <el-input disabled v-model="modelServe.name"></el-input>
                </el-form-item>
                <el-form-item label="标识">
                  <el-input disabled v-model="modelServe.identifier"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="1">
              <el-button type="text" @click="modifyModelServe(modelServe)">修改</el-button>
            </el-col>
            <el-col :span="1">
              <el-button type="text" @click="deleteModelServe(modelServeIdx)">删除</el-button>
            </el-col>
          </el-row>
        </div>
        <el-row style="margin-left: 10px">
          <el-button type="text" icon="el-icon-plus" @click="addModelServe">新增物模型服务</el-button>
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
    <el-dialog title="物模型属性" :visible.sync="proEditorVisible">
      <DeviceModelPro @save="saveModelPro" @close="proEditorVisible=false" ref="modelProEditor"></DeviceModelPro>
    </el-dialog>
    <el-dialog title="物模型服务" :visible.sync="serveEditorVisible">
      <DeviceModelSer @save="saveModelServe" @close="serveEditorVisible=false" ref="modelServeEditor"></DeviceModelSer>
    </el-dialog>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';
import DeviceModelPro from "@/components/DeviceModePro";
import DeviceModelSer from "@/components/DeviceModelSer";

export default {
  name: 'ProductCreate',
  components: {DeviceModelPro,DeviceModelSer},
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
      proEditorVisible: false,

      modelProsStore:[],

      serveEditorVisible: false,

      modelServesStore:[],


      modelPros: [],
      modelServes:[] ,
      /** form */
      productForm: {
        name: '',
        description: '',
        modelPro: [],
        modelServe: [],
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
    addModelPro() {
      let tmp = {
        modelType:'modelPro',
        identifier:'',
        name: '',
        description: '',
        dataType: null,
        enabled: true,
        accessMode:'',
      };
      this.proEditorVisible = true;
      this.$nextTick(() => {
        this.$refs.modelProEditor.modelForm = tmp;
      });
    },
    modifyModelPro (pro) {
      this.proEditorVisible = true;
      this.$refs.modelProEditor.aim = 'modify';
      this.$refs.modelProEditor.modelForm = pro;
    },
    saveModelPro (pro) {
      this.productForm.modelPro.push(pro);
    },
    deleteModelPro(proIdx) {
      this.productForm.modelPro.splice(proIdx, 1);
    },

    addModelServe() {
      let tmp = {
        modelType:'',
        identifier:'',
        name: '',
        description: '',
        dataType: null,
        params:[],
        enabled: true,
        accessMode:'',
      }
      this.serveEditorVisible = true;
      this.$nextTick(() => {
        this.$refs.modelServeEditor.modelForm = tmp;
        this.$refs.modelServeEditor.modelPros = this.productForm.modelPro;
      });
    },
    modifyModelServe(serve) {
      this.serveEditorVisible = true;
      this.$refs.modelServeEdit.aim = 'modify';
      this.$refs.modelServeEdit.modelForm = serve;
      this.$refs.modelServeEditor.modelPros = this.productForm.modelPro;
    },
    deleteModelServe(serveIdx) {
      this.productForm.modelServe.splice(serveIdx, 1);
    },
    saveModelServe (serve) {
      this.productForm.modelServe.push(serve);
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