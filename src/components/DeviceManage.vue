<template>
  <el-container>
    <el-main>
      <h3>设备</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/device_manage'}">设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-table :data="devices">
        <el-table-column label="设备名称">
          <template slot-scope="scope">
            <span>{{scope.row.deviceName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品id">
          <template slot-scope="scope">
            <span>{{scope.row.productId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备描述">
          <template slot-scope="scope">
            <span class="omission">{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备所属工厂">
          <template slot-scope="scope">
            <span>{{scope.row.industry}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上/下线情况">
          <template slot-scope="scope">
            <span>{{scope.row.deviceState}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.deviceState === '下线'" type="text" @click="online(scope.row)">上线</el-button>
            <el-button v-else type="text" @click="offline(scope.row)">下线</el-button>
            <el-button type="text" @click="remove(scope.row,scope.$index)">删除</el-button>
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
  name: 'DeviceManage',
  components: {LogDisplay},
  data() {
    return {
      devices: [],
      dialogTableVisible: false,

      logRuleId: null,
      logProductId: null,
      logDeviceId: null
    };
  },
  mounted() {
    let url = '/device-service/device/getAll'
    Api.get(url).then((data) => {
      if (data) this.devices = data;
    }).catch(() => {
    });
  },
  methods: {
    online(device) {
      let url = '/device-service/device/onlineDevice/'+ device.deviceId
      Api.get(url, device).then((data) => {
        if (data) {
          device.deviceState = "上线";
          this.$message.success("设备上线成功");
        } else {
          this.$message.warning("设备上线失败");

        }
      }).catch(() => {});
    },
    offline(device) {
      let url = '/device-service/device/offlineDevice/'+device.deviceId
      Api.get(url, device).then((data) => {
        if (data) {
          device.deviceState = "下线";
          this.$message.success("设备下线成功");
        } else {
          this.$message.warning("设备下线失败");
        }
      }).catch(() => {});
    },
    startDeivce(device) {
      let url = '/device-service/device/startDevice/'+device.deviceId
      Api.get(url, device).then((data) => {
        if (data) {
          device.state = "启用";
          this.$message.success("设备启用成功");
        } else {
          this.$message.warning("修改设备失败");
        }
      }).catch(() => {});
    },
    endDevice(device) {
      let url = '/device-service/device/endDevice/'+device.deviceId
      Api.get(url, device).then((data) => {
        if (data) {
          device.state = "禁用";
          this.$message.success("设备禁用成功");
        } else {
          this.$message.warning("设备禁用失败");
        }
      }).catch(() => {});
    },
    update(device) {
      this.$router.push({name: 'ruleEdit', params: {rid: device.id, aim: 'modify'}});
    },
    remove(device, idx) {
      this.$confirm('此操作将删除该规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/device-service/device/delete/' + device.deviceId
        Api.delete(url).then((data) => {
          if (data) {
            this.$message.success("删除规则成功");
            this.devices.splice(idx, 1);
          } else {
            this.$message.warning("删除规则失败");
          }
        }).catch(() => {});
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    device(device) {
      this.logRuleId = device.id;
      this.dialogTableVisible = true;
    }
  }
};
</script>

<style scoped>
</style>