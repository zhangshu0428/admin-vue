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
    :active="active"
    finish-status="success"
    align-center>
    <el-step title="基本信息"></el-step>
    <el-step title="商品参数"></el-step>
    <el-step title="商品属性"></el-step>
    <el-step title="商品图片"></el-step>
    <el-step title="商品内容"></el-step>
  </el-steps>
  <!-- 选项卡 -->
  <el-form v-model="form" label-width="100px">
    <el-tabs tab-position="left" @tab-click="handleTabClick">
      <el-tab-pane label="基本信息">
        <el-form-item label="商品名称">
          <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="form.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
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
      </el-tab-pane>
      <el-tab-pane label="商品参数">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 表单数据
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      },
      // 选项卡选中
      active: 0,
      // 级联选择器
      // 数据源
      options: [],
      // 数据源中需要在级联选择器中显示的属性
      defaultProps: {
        // 指定选项的值为选项对象的某个属性值
        value: '',
        // 指定选项标签为选项对象的某个属性值
        label: '',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      // 选中分类中的父id
      catIds: []
    };
  },
  methods: {
    // 处理步骤条与选项卡之间的关系
    handleTabClick(tab, event) {
      console.log(tab, event);
      this.active = tab.index - 0;
    }
  }
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
