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
        @change="handleCatChange"
      ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tab 栏切换 -->
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane label="动态参数" name="many">
        <!-- 按钮 -->
        <el-button type="primary" :disabled="catIds.length === 3? false: true">添加动态参数</el-button>
        <!-- 动态表格 -->
        <el-table
          stripe
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="expand">
            <template slot-scope="scope">
              <el-row :span="24">
                <!-- {{ scope.row }} -->
                <el-tag
                @close="handleTabClose(param, scope.row)"
                closable
                type="success"
                v-for="param in scope.row.params"
                :key="param"
                class="tag">
                      {{ param }}
                </el-tag>
                <!-- 可以新增的标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm((scope.row))"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="attr_name"
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
      <el-tab-pane label="静态参数" name="only">
        <el-button type="primary" :disabled="catIds.length === 3? false: true">添加静态参数</el-button>
        <!-- 静态表格 -->
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
            prop="attr_name"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性值"
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
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      catIds: [],
      defaultProps: {
        label: 'cat_name',
        value: 'cat_id'
      },
      // 商品分类数据
      options: [],
      // tab栏选中的一栏的name
      activeName: 'many',
      // 放表格数据
      tableData: [],
      // 新增标签的输入框默认不显示
      inputVisible: false,
      // 绑定新增标签的输入框内容
      inputValue: ''
    };
  },
  created() {
    // 发送请求，获取商品分类数据
    this.goodsCategoryList();
  },
  methods: {
    // 选项卡切换的时候触发
    async handleTabClick() {
      // console.log(this.activeName);
      // // 发送请求，获取参数数据
      // const response = await this.$http.get(`categories/${this.catIds[2]}/attributes?sel=${this.activeName}`);
      // console.log(response);
      // this.tableData = response.data.data;
      // 以上代码优化
      this.handleCatChange();
    },
    // 发送请求，获取商品分类数据
    async goodsCategoryList() {
      const response = await this.$http.get('categories?type=3');
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // console.log(response);
        this.options = response.data.data;
      } else {
        this.$message.error(msg);
      }
    },
    // 级联选择器改变的时候触发事件
    async handleCatChange() {
      // 判断选择的是否是三级分类
      if (this.catIds.length === 3) {
        // 发送请求，默认获取动态参数数据
        const response = await this.$http.get(`categories/${this.catIds[2]}/attributes?sel=${this.activeName}`);
        // console.log(response);
        this.tableData = response.data.data;
        // console.log(this.tableData);
        // 如果是动态参数，则添加一个params数组
        if (this.activeName === 'many') {
          this.tableData.forEach((item) => {
            // 动态给每一项添加属性
            this.$set(item, 'params', item.attr_vals.split(','));
          });
        }
      }
    },
    // 关闭每个tag的时候触发
    async handleTabClose(tag, lineInfo) {
      // 将params中的数据去掉，并且发送请求进行删除
      // 获取删除标签的下标
      // console.log(tag);
      const index = lineInfo.params.findIndex((item) => {
        if (item === tag) {
          return true;
        };
      });
      lineInfo.params.splice(index, 1);
      // 发送请求
      const response = await this.$http.put(`categories/${this.catIds[2]}/attributes/${lineInfo.attr_id}`, {
        attr_vals: lineInfo.params.join(','),
        attr_name: lineInfo.attr_name,
        attr_sel: this.activeName
      });
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 处理新增标签的相关事件
    showInput() {
      this.inputVisible = true;
      // 点击标签后，让输入框自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 处理新增标签
    async handleInputConfirm(info) {
      let inputValue = this.inputValue;
      // 先判断输入框中是否输入了内容
      if (!inputValue) {
        return;
      };
      info.params.push(inputValue);
      // 发送请求成功后，将新添加的标签增加到params数组中
      const response = await this.$http.put(`categories/${this.catIds[2]}/attributes/${info.attr_id}`, {
        attr_vals: info.params.join(','),
        attr_name: info.attr_name,
        attr_sel: this.activeName
      });
      console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        this.inputVisible = false;
        this.inputValue = '';
      } else {
        this.$message.error(msg);
      };
    }
  }
};
</script>

<style>
.alert {
  margin: 10px 0;
}
.tag {
  margin-right: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
