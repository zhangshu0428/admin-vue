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
  <el-form v-model="form" label-width="100px" label-position="top">
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
          {{ catIds }}
          <el-cascader
          clearable
          expand-trigger="hover"
          v-model="catIds"
          :props="defaultProps"
          placeholder="请选择商品分类"
          :options="options"
          @change="handleChange"
        ></el-cascader>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <el-form-item :label="item.attr_name" v-for="item in paramData" :key="item.attr_id">
          <el-checkbox-group>
            <el-checkbox
            :label="param"
            border
            v-for="param in item.params"
            :key="param"
            checked>
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
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
        value: 'cat_id',
        // 指定选项标签为选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      },
      // 选中分类中的父id
      catIds: [],
      // 商品参数的数据
      paramData: []
    };
  },
  created() {
    // 获取级联选择器中商品分类数据
    this.loadData();
  },
  methods: {
    // 处理步骤条与选项卡之间的关系，点击选项卡的时候触发
    async handleTabClick(tab, event) {
      // console.log(tab, event);
      this.active = tab.index - 0;
      // 判断点击的是否是商品参数和商品属性，若是，判断是否选择了三级商品分类
      if (tab.index === '1' || tab.index === '2') {
        if (this.catIds.length === 0) {
          // 提示
          this.$message.error('请选择商品分类');
        } else {
          // 选择了商品分类，发送请求，获取参数数据
          const response = await this.$http.get(`categories/${this.catIds[2]}/attributes?sel=many`);
          // console.log(response);
          const { meta: { status, msg } } = response.data;
          if (status === 200) {
            this.paramData = response.data.data;
            // console.log(this.paramData);
            // 处理参数类型，把字符串转为数组，动态添加数组
            this.paramData.map((item) => {
              const arr = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
              this.$set(item, 'params', arr);
              // console.log(item);
            });
          } else {
            this.$message.error(msg);
          }
        }
      }
    },
    // 获取基本信息中级联选择器中商品分类数据
    async loadData() {
      // 发送请求，获取商品分类
      const response = await this.$http.get('categories?type=3');
      this.options = response.data.data;
    },
    // 基本信息中 文本框的内容变化时触发
    handleChange() {
      // 只能添加第三级商品，文本框中只能显示第三级商品
      if (this.catIds.length !== 3) {
        this.catIds.length = 0;
        // 给出提示，只能选择三级分类
        this.$message.warning('请选择三级分类');
      }
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
