<template>
  <el-container>
    <el-main>
      <h3>产品</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/device_manage'}">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>产品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-table :data="products">
        <el-table-column label="编号">
          <template slot-scope="scope">
            <span>{{scope.row.productId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.productName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeEnabled($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="update(scope.row)">修改</el-button>
            <el-button type="text" @click="remove(scope.row)">删除</el-button>
            <el-button type="text" @click="viewLogs(scope.row)">日志</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-dialog title="日志" :visible.sync="dialogTableVisible">
      <LogDisplay
          :rule-id="logRuleId"
          :product-id="logProductId"
          :device-id="logDeviceId">
      </LogDisplay>
    </el-dialog>
  </el-container>
</template>

<script>
import Api from '../assets/js/api';
import LogDisplay from "@/components/LogDisplay";

export default {
  name: 'ProductManage',
  components: {LogDisplay},
  data() {
    return {
      products: [],
      dialogTableVisible: false,

      logRuleId: null,
      logProductId: null,
      logDeviceId: null
    };
  },
  mounted() {
    let url = '/device-service/product/getProductByProductId/'+sessionStorage.getItem("projectId")
    Api.get(url).then((data) => {
      if (data) this.products = data;
    }).catch(() => {
    });
  },
  methods: {
    changeEnabled(state, product) {
      let url = '/device-service/product/updateProduct'
      Api.post(url, product).then((data) => {
        if (data) {
          this.$message.success("修改状态成功");
        } else {
          this.$message.warning("修改状态失败");
          product.enabled = !product.enabled;
        }
      }).catch(() => {});
    },
    update(product) {
      this.$router.push({name: 'productCreate', params: {rid: product.productId, aim: 'modify'}});
    },
    remove(product, idx) {
      this.$confirm('此操作将删除该产品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/device-service/product/delete';
        Api.delete(url, {productId: product.productId}).then((data) => {
          if (data) {
            this.$message.success("删除产品成功");
            this.products.splice(idx, 1);
          } else {
            this.$message.warning("删除产品失败");
          }
        }).catch(() => {});
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    viewLogs(product) {
      this.logProductId = product.productId;
      this.dialogTableVisible = true;
    }
  }
};
</script>

<style scoped>
</style>