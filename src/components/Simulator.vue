<template>
  <el-container>
    <el-main style="padding-top: 0">
      <h3>设备模拟</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/rule_manage'}">设备模拟</el-breadcrumb-item>
      </el-breadcrumb>
      <el-form :model="factForm" ref="factForm" style="padding-left: 2%">
        <!--产品 设备-->
        <el-row style="padding-top: 15px">
          <el-col :span="6">
            <el-form-item prop="productId" label="产品">
              <el-select v-model="factForm.productId" :value="factForm.productId">
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
            <el-form-item v-if="factForm.productId" prop="deviceId" label="设备">
              <el-select v-model="factForm.deviceId" :value="factForm.deviceId">
                <el-option
                    v-for="d in devices[factForm.productId]"
                    :key="d.id"
                    :label="d.name"
                    :value="d.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-left: 10px">
          <el-button type="text" icon="el-icon-plus" @click="addParam">新增参数</el-button>
        </el-row>
        <div style="background-color: var(--theme-grey); margin-top: 10px; margin-bottom: 10px">
          <!--action params-->
          <el-row :gutter="5" style="margin-left: 8px; padding-top: 10px"
                  v-for="(param, pIdx) in factForm.params" :key="pIdx">
            <el-col :span="4">
              <el-form-item>
                <el-select v-model="param.property" :value="param.property">
                  <el-option
                      v-for="prop in properties[factForm.productId]"
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
              <el-button type="text" @click="deleteParam(pIdx)">删除</el-button>
            </el-col>
          </el-row>
        </div>

        <!--保存 重置-->
        <el-row>
          <el-col :span="6" :offset="4">
            <el-button type="primary" @click="submit('factForm')">提交</el-button>
            <el-button type="plain" @click="reset('factForm')">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';

export default {
  name: 'Simulator',
  mounted() {
    // Api.get('/get_categories', {restaurant: sessionStorage.getItem('id')}).then((data) => {
    //   if (data) {
    //     this.products = [];
    //   }
    // }).catch(() => {
    // });
    console.log(sessionStorage.getItem('projectId'));
  },
  data() {
    return {
      products: [
        {id: 1, name: '温度传感器'}
      ],
      devices: {
        1: [{id: 1, name: '水温计'}]
      },
      properties: {
        1: [{name: 'temperature'}]
      },
      /** form */
      factForm: {
        productId: null,
        deviceId: null,
        params: [],
      }
    };
  },
  methods: {
    addParam() {
      this.factForm.params.push({property: '', value: ''});
    },
    deleteParam(pIdx) {
      this.factForm.params.splice(pIdx, 1);
    },

    reset(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let paramMap = {}
          for (let i = 0; i < this.factForm.params.length; i++) {
            this.factForm.params.forEach(param => {
              if (!isNaN(param.value)) param.value = Number(param.value);
              paramMap[param.property] = param.value;
            });
          }
          paramMap['productId'] = this.factForm.productId;
          paramMap['deviceId'] = this.factForm.deviceId;

          let url = '/rule-service/' + sessionStorage.getItem('projectId') + '/rules/_execute';
          Api.post(url, paramMap).then(() => {}).catch(() => {});
          this.$message.success("消息发送成功");
        }
      })
    }
  }
};
</script>

<style scoped>

</style>