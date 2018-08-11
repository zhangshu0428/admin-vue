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
      v-loading="loading"
      stripe
      border
      :data="tableData"
      style="width: 100%;margin-top:10px">
       <el-table-column type="expand">
         <template slot-scope="scope">
            <!-- 放置该行的具体权限 -->
            <el-row v-for="level1 in scope.row.children" :key="level1.id" class="level1">
              <el-col :span="4">
                <!-- 放置一级权限 -->
                <el-tag closable type="success">
                  {{ level1.authName }}
                </el-tag>
              </el-col>
              <el-col :span="20">
                <!-- 放置二级权限及三级权限的包裹 -->
                <el-row v-for="level2 in level1.children" :key="level2.id" class="level2">
                  <el-col :span="4">
                    <!-- 放置二级权限 -->
                    <el-tag closable type="warning">
                      {{ level2.authName }}
                    </el-tag>
                  </el-col>
                  <el-col :span="20">
                    <!-- 放置三级权限 -->
                    <el-tag closable v-for="level3 in level2.children" :key="level3.id" class="level3">
                      {{ level3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="scope.row.children.length === 0">没有权限</el-row>
         </template>
       </el-table-column>
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
      tableData: [],
      loading: true
    };
  },
  created() {
    this.rolesList();
  },
  methods: {
    async rolesList() {
      // 发送获取角色列表的请求
      const response = await this.$http.get('roles');
      console.log(response);
      // 数据加载完后，动画隐藏
      this.loading = false;
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
.level1,.level2,.level3 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 10px;
}
</style>
