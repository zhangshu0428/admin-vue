<template>
  <el-card class="card">
    <my-breadcrumb level1="商品管理" level2="分类参数"></my-breadcrumb>
    <!-- 警告 -->
    <el-alert
      :closable="false"
      class="alert"
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon>
    </el-alert>
    <!-- 级联选择器 -->
    <el-form
      label-width="80">
      <el-form-item label="请选择商品分类">
        <el-cascader
        clearable
        expand-trigger="hover"
        v-model="catIds"
        :props="defaultProps"
        placeholder="请选择商品分类"
        :options="options"
        change-on-select
      ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tab 栏切换 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="first">
        <!-- 按钮 -->
        <el-button type="primary">添加动态参数</el-button>
        <!-- 表格 -->
        <el-table
          type="expand"
          stripe
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="tableData.attr_name"
            label="商品参数"
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
              </el-row>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="second">
        <el-button type="primary">添加静态参数</el-button>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      catIds: [],
      defaultProps: {},
      options: [],
      // tab栏选中的一栏的name
      activeName: 'first',
      tableData: []
    };
  },
  methods: {
    // 选项卡切换的时候触发
    handleTabClick() {
    }
  }
};
</script>

<style>
.alert {
  margin: 10px 0;
}
</style>
