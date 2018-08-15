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
        <el-form-item :label="item.attr_name" v-for="item in dynamicParams" :key="item.attr_id">
          <el-checkbox-group v-model="item.params">
            <el-checkbox
            :label="param"
            border
            v-for="param in item.params"
            :key="param">
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <el-form-item :label="staticItem.attr_name" v-for="staticItem in staticParams" :key="staticItem.attr_id">
          <el-input v-model="staticItem.attr_vals"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        <!-- 上传图片,不是axios请求，所以地址要完整，并且要携带token -->
        <el-upload
          :headers="headers"
          action="http://localhost:8888/api/private/v1/upload"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">
        <el-button type="primary" @click="handleSubmitAdd">添加商品</el-button>
        <!-- 富文本框 -->
        <quill-editor v-model="form.goods_introduce"></quill-editor>
      </el-tab-pane>
    </el-tabs>
  </el-form>
  </el-card>
</template>

<script>
// 富文本框
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      // 表单数据
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_introduce: '',
        goods_cat: '',
        // 存放临时图片路径对象
        pics: [],
        attrs: []
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
      // 商品动态参数的数据
      dynamicParams: [],
      // 商品静态参数的数据
      staticParams: [],
      // 请求参数时的sel类型
      paramType: '',
      // 上传图片的请求头
      headers: {
        Authorization: sessionStorage.getItem('token')
      }
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
          // 判断是点击商品参数还是商品属性，以此判断是发动态参数请求还是静态参数请求
          this.paramType = tab.index === '1' ? 'many' : 'only';
          // 选择了商品分类，发送请求，获取参数数据
          const response = await this.$http.get(`categories/${this.catIds[2]}/attributes?sel=${this.paramType}`);
          // console.log(response);
          const { meta: { status, msg } } = response.data;
          if (status === 200) {
            if (this.paramType === 'many') {
              this.dynamicParams = response.data.data;
              // console.log(this.dynamicParams);
              // 处理参数类型，把字符串转为数组，动态添加数组
              this.dynamicParams.map((item) => {
                const arr = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
                this.$set(item, 'params', arr);
                // console.log(item);
              });
            } else if (this.paramType === 'only') {
              this.staticParams = response.data.data;
              // console.log(this.staticParams);
            }
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
    },
    // 处理上传图片
    // 删除图片
    handleRemove(file, fileList) {
      // console.log(file, fileList);
      // 点击删除图片后，需要把图片从pics数组中删除
      const index = this.pics.findIndex((item) => {
        if (item.pic === file.response.data.tmp_path) {
          return true;
        }
      });
      // console.log(index);
      this.form.pics.slice(index, 1);
    },
    // 图片上传成功
    handleSuccess(response, file, fileList) {
      // console.log(response, file, fileList);
      // 上传成功后，把临时路径存放起来
      this.form.pics.push({
        'pic': response.data.tmp_path
      });
    },
    // 点击添加商品
    async handleSubmitAdd() {
      // 发送请求前，需要把参数都准备好 goods_cat attrs
      this.form.goods_cat = this.catIds.join(',');
      // 分别获取静态参数和动态参数
      console.log(this.dynamicParams, this.staticParams);
      // 基于dynamicParams数组生成一个新的数组
      const dynamicArr = this.dynamicParams.map((item) => {
        // 返回一个新数组
        return {
          'attr_id': item.attr_id,
          'attr_vals': item.params.join(',')
        };
      });
      // 基于staticParams数组生成一个新的数组
      const staticArr = this.staticParams.map((item) => {
        // 返回一个新数组
        return {
          'attr_id': item.attr_id,
          'attr_vals': item.attr_vals
        };
      });
      console.log(dynamicArr, staticArr);
      // 合并数组
      this.form.attrs = [...dynamicArr, ...staticArr];
      // 发送请求
      const response = await this.$http.post('goods', this.form);
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        // 返回商品列表页
        this.$router.push('/goods');
      } else {
        this.$message.error(msg);
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
.ql-editor {
  height: 300px;
}
</style>
