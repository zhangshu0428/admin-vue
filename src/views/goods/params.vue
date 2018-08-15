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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      catIds: [],
      defaultProps: {},
      options: []
    };
  }
};
</script>

<style>
.alert {
  margin: 10px 0;
}
</style>
