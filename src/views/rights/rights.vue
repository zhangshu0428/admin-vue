<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-breadcrumb level1="权限管理" level2="权限列表"></my-breadcrumb>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="tableData"
      style="width: 100%;margin-top:10px">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="180">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true
    };
  },
  created() {
    this.rightslist();
  },
  methods: {
    // 获取权限列表
    async rightslist() {
      const response = await this.$http.get('rights/list');
      // 数据加载完后，动画隐藏
      this.loading = false;
      this.tableData = response.data.data;
    }
  }
};
</script>

<style>

</style>
