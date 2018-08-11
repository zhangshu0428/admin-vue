<template>
    <el-card class="card">
    <!-- 面包屑组件
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <!-- 表格 -->
    <el-table
      stripe
      border
      :data="tableData"
      style="width: 100%;margin-top:10px">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-row>
            <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"></el-button>
            <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"></el-button>
            <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  created() {
    this.rolesList();
  },
  methods: {
    async rolesList() {
      // 发送获取角色列表的请求
      const response = await this.$http.get('roles');
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>

</style>
