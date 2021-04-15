<template>
  <el-container>
    <el-main>
      <h3>规则管理</h3>
      <hr/>
      <el-breadcrumb separator-class="el-icon-arrow-right" style="padding: 10px 0 10px 30px">
        <el-breadcrumb-item :to="{path: '/dashboard/rule_manage'}">规则引擎</el-breadcrumb-item>
        <el-breadcrumb-item>规则管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-table :data="rules">
        <el-table-column label="编号">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述">
          <template slot-scope="scope">
            <span class="omission">{{scope.row.description}}</span>
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
            <el-button type="text" @click="update(scope.row)">编辑</el-button>
            <el-button type="text" @click="remove(scope.row, scope.$index)">删除</el-button>
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
  name: 'RuleManage',
  components: {LogDisplay},
  data() {
    return {
      rules: [],
      dialogTableVisible: false,

      logRuleId: null,
      logProductId: null,
      logDeviceId: null
    };
  },
  mounted() {
    let url = '/rule-service/' + sessionStorage.getItem('projectId') + '/rules'
    Api.get(url).then((data) => {
      if (data) this.rules = data;
    }).catch(() => {
    });
  },
  methods: {
    changeEnabled(state, rule) {
      let url = '/rule-service/' + sessionStorage.getItem('projectId') + '/rules'
      Api.put(url, rule).then((data) => {
        if (data) {
          this.$message.success("修改状态成功");
        } else {
          this.$message.warning("修改状态失败");
          rule.enabled = !rule.enabled;
        }
      }).catch(() => {});
    },
    update(rule) {
     this.$router.push({name: 'ruleEdit', params: {rid: rule.id, aim: 'modify'}});
    },
    remove(rule, idx) {
      this.$confirm('此操作将删除该规则, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/rule-service/' + sessionStorage.getItem('projectId') + '/rules/' + rule.id
        Api.delete(url).then((data) => {
          if (data) {
            this.$message.success("删除规则成功");
            this.rules.splice(idx, 1);
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
    viewLogs(rule) {
      this.logRuleId = rule.id;
      this.dialogTableVisible = true;
    }
  }
};
</script>

<style scoped>
</style>