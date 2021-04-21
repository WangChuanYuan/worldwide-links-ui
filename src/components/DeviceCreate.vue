<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>设备创建</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/device_manage'}">设备管理</el-breadcrumb-item>
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


        <el-row el-row style="padding-top: 15px">
          <el-col :span="2">
            <b>所属产品</b>
          </el-col>
          <el-col :span="2">
            <el-tooltip content="所属产品" placement="right">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-col>
        </el-row>

        <el-form-item prop="productId" label="产品">
          <el-select v-model="deviceForm.productId"  :value="deviceForm.productId">
            <el-option
                v-for="p in products"
                :key="p.productId"
                :label="p.productName"
                :value="p.productId">
            </el-option>
          </el-select>
        </el-form-item>

        <!--        &lt;!&ndash;产品 设备&ndash;&gt;-->
<!--        <el-row style="padding-top: 15px">-->
<!--          <el-col :span="6">-->
<!--            <el-form-item prop="modelProId" label="物模型-属性">-->
<!--              <el-select v-model="deviceForm.modelProId" :value="deviceForm.modelProId">-->
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
<!--            <el-form-item v-if="deviceForm.modelProId" prop="modelServeId" label="物模型-服务">-->
<!--              <el-select v-model="deviceForm.modelServeId" :value="deviceForm.modelServeId">-->
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


        <!--保存 重置-->
        <el-row>
          <el-col :span="6" :offset="4">
            <el-button type="primary" @click="submit('deviceForm')">保存</el-button>
            <el-button type="plain" @click="reset('deviceForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
    <el-dialog title="物模型属性" :visible.sync="modelProVisible">
      <DeviceModelPro :model-pro="modelPro2Edit" @close="modelProVisible=false"></DeviceModelPro>
    </el-dialog>
    <el-dialog title="物模型服务" :visible.sync="modelServeVisible">
      <DeviceModelSer :model-pro="modelServe2Edit" @close="modelServeVisible=false"></DeviceModelSer>
    </el-dialog>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';
import DeviceModelPro from "@/components/DeviceModePro";
import DeviceModelSer from "@/components/DeviceModelSer";

export default {
  name: 'DeviceCreate',
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
    let url = '/device-service/product/getProductByProjectId'+sessionStorage.getItem("projectId")
    Api.get(url).then((data) => {
      if (data) this.products = data;
    }).catch(() => {
    });
    if (this.aim === 'modify') {
      let url = '/device-service/device/getDeviceById/' + this.rid;
      let _this = this;
      Api.get(url).then((data) => {
        if (data) {
          _this.deviceForm.name = data.deviceName;
          _this.deviceForm.description = data.description;
          _this.deviceForm.industry = data.industry;
          _this.deviceForm.password = data.password;
          _this.deviceForm.modelPro = data.modelPro;
          _this.deviceForm.modelServe = data.modelServe;
          _this.deviceForm.productId = data.productId;
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

      modelServeVisible: false,
      modelServe2Edit: {},

      modelServesStore:[],


      modelPros: [],
      modelServes: [],

      products:[],

      /** form */
      deviceForm: {
        name: '',
        description: '',
        industry:'',
        password:'',
        modelPro: [],
        modelServe: [],
        productId:'',
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
        password: [
          {
            required:true,
            message: '请输入mqtt密码',
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
    addModelPro() {
      let tmp = {
        modelType:'modelPro',
        identifier:'',
        name: '',
        description: '',
        dataType: null,
        accessMode:'',
      }
      this.deviceForm.modelPro.push(tmp);
      this.modelProVisible = true;
      this.modelPro2Edit = tmp;
    },

    addModelServe() {
      let tmp = {
        modelType:'',
        identifier:'',
        name: '',
        description: '',
        dates: [],
        dataType: null,
        deviceId: null,
        params:[],
        enabled: true,
        accessMode:'',
      }
      this.deviceForm.modelServe.push(tmp);
      this.modelServeVisible = true;
      this.modelServeEdit = tmp;
    },
    deleteModelPro(proIdx) {
      this.deviceForm.modelPro.splice(proIdx, 1);
    },

    deleteModelServe(serveIdx) {
      this.deviceForm.modelServe.splice(serveIdx, 1);
    },


    reset(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          /*for (let i = 0; i < this.deviceForm.triggers.length; i++) {
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
          }*/
          let device = {};
          device['deviceName'] = this.deviceForm.name;
          device['description'] = this.deviceForm.description;
          device['projectId'] = sessionStorage.getItem('projectId');
          device['industry'] = this.deviceForm.industry;
          device['deviceState']='下线';
          device['logo']='';
          device['location']='';
          device['username']=sessionStorage.getItem("userId");
          console.log(this.deviceForm.productId);
          device['password']=this.deviceForm.password;
          device['productId']=this.deviceForm.productId;
          let url = '/device-service/device/create/'+sessionStorage.getItem('projectId') ;
          if (this.aim === 'modify') {
            device['deviceId'] =  this.rid;
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
                this.$message.success("新建设备成功，设备id" + data.deviceId);
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