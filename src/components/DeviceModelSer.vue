<template>
  <el-container>
    <el-main style="padding-top: 0">
      <!--      <h3>物模型创建</h3>-->
      <!--      <hr/>-->
      <!--      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">-->
      <!--        <el-breadcrumb-item :to="{path: '/dashboard/device_manage'}">设备管理</el-breadcrumb-item>-->
      <!--        <el-breadcrumb-item>物模型创建</el-breadcrumb-item>-->
      <!--      </el-breadcrumb>-->
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
            <b>服务参数</b>
          </el-col>
        </el-row>

        <el-row :gutter="5" style="margin-left: 8px; padding-top: 15px"
                v-for="(param, paramIdx) in modelForm.params" :key="paramIdx">
        <el-col :span="4">
          <el-form-item>
            <el-select v-model="param.identifier" :value="param.identifier" placeholder="服务参数">
              <el-option
                  v-for="prop in modelPros"
                  :key="prop.identifier"
                  :label="prop.name"
                  :value="prop.identifier">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="2">
          <el-button type="text" @click="deletePro(paramIdx)">删除</el-button>
        </el-col>
        </el-row>
        <el-row style="margin-left: 10px">
          <el-button type="text" @click="addPro()">添加</el-button>
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
  name: 'DeviceModelServe',
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

  },
  data() {
    return {

      modelPros: [],

      /** form */
      modelForm: {
        modelType:'',
        identifier:'',
        name: '',
        description: '',
        dataType: null,
        deviceId: null,
        params:[],
        enabled: true,
        accessMode:'',
      },
      ruleRules: {
        name: [
          {
            required: true,
            message: '请输入服务名称',
            trigger: 'blur'
          }
        ],
        identifier: [
          {
            required: true,
            message: '请输入服务标识',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: false,
            message: '请输入服务描述',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    addPro() {
      this.modelForm.params.push({identifier: '', name: '',});
    },
    deletePro(proIdx) {
      this.modelForm.params.splice(proIdx, 1);
    },

    reset(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // for (let i = 0; i < this.modelForm.triggers.length; i++) {
          //   this.modelForm.triggers[i].conditions.forEach(condition => {
          //     if (!isNaN(condition.value)) condition.value = Number(condition.value);
          //   });
          // }
          // let actions_ = []
          // for (let i = 0; i < this.modelForm.actions.length; i++) {
          //   actions_.push({name: this.modelForm.actions[i].name, params: {}});
          //   let paramMap = {}
          //   this.modelForm.actions[i].params.forEach(param => {
          //     if (!isNaN(param.value)) param.value = Number(param.value);
          //     paramMap[param.property] = param.value;
          //   });
          //   actions_[i].params = paramMap
          // }
          let model = {};
          model['name'] = this.modelForm.name;
          model['identifier'] = this.modelForm.identifier;
          model['description'] = this.modelForm.description;
          model['params'] = this.modelForm.params;

          let url = '/device-service/modelServe/create';
          if (this.aim === 'modify') {
            url = '/device-service/modelServe/updateModelServe';
            Api.put(url, model).then((data) => {
              if (data) {
                this.$emit('close');
              } else this.$message.warning("修改物模型失败");
            }).catch(() => {
            });
          } else {
            Api.post(url, model).then((data) => {
              if (data) {
                // this.$message.success("新建物模型成功");
                this.$emit("save", model);
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