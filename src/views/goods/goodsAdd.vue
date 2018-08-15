<template>
  <!-- 面包屑 -->
  <el-card class="card">
  <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
  <!-- 警告框 -->
  <el-alert
    class="alert"
    :closable="false"
    title="添加商品信息"
    type="info"
    center
    show-icon>
  </el-alert>
  <!-- 步骤条 -->
  <el-steps
    class="steps"
    :space="200"
    :active="1"
    finish-status="success"
    align-center>
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
  </el-steps>
  <!-- 选项卡 -->
  <el-tabs tab-position="left" style="height: 200px;">
    <el-tab-pane label="基本信息">基本信息</el-tab-pane>
    <el-tab-pane label="商品参数">商品参数</el-tab-pane>
    <el-tab-pane label="商品属性">商品属性</el-tab-pane>
    <el-tab-pane label="商品图片">商品图片</el-tab-pane>
    <el-tab-pane label="商品内容">商品内容</el-tab-pane>
  </el-tabs>
  </el-card>
</template>

<script>
export default {

};
</script>

<style>
.alert {
  margin: 20px 0;
}
.steps {
  margin-bottom: 30px;
}
.el-steps .el-step__title {
  font-size: 12px;
}
</style>
