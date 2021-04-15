<template>
  <el-table :data="logs">
    <el-table-column label="时间" width="100px" fixed="left">
      <template slot-scope="scope">
        <span>{{scope.row.time}}</span>
      </template>
    </el-table-column>
    <el-table-column label="日志" min-width="600px">
      <template slot-scope="scope">
        <el-input
            type="textarea"
            :autosize="{minRows: 2}"
            v-model="scope.row.content">
        </el-input>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Api from "@/assets/js/api";

export default {
  name: "LogDisplay",
  props: {
    'productId': {
      type: Number,
      default: null
    },
    'deviceId': {
      type: Number,
      default: null
    },
    'ruleId': {
      type: Number,
      default: null
    }
  },
  mounted() {
    let url = '/rule-service/' + sessionStorage.getItem('projectId') + '/logs'
    let params = {
      ruleId: this.ruleId,
      productId: this.productId,
      deviceId: this.deviceId
    };
    Api.get(url, params).then((data) => {
      if (data) this.logs = data;
    }).catch(() => {
    });
  },
  data() {
    return {
      logs: []
    };
  }
}
</script>

<style scoped>

</style>