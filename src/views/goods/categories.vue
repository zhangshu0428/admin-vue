<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <el-row>
        <el-button
        type="success"
        plain
        @click="handleAddCat"
        class="addBtn">添加分类</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="tableData"
      style="width: 100%">
      <!-- <el-table-column
        prop="cat_name"
        label="分类名称"
        width="400">
      </el-table-column> -->
      <elementreeGrid
        prop="cat_name"
        label="分类名称"
        width="400"
        treeKey="cat_id"
        parentKey="cat_pid"
        childKey="children"
        levelKey="cat_level">
      </elementreeGrid>
      <el-table-column
        prop="cat_level"
        label="级别"
        width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效"
        width="100">
         <template slot-scope="scope">
          {{ scope.row.cat_deleted ? '无效' : '有效' }}
        </template>
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
    <!-- 分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
<!-- 添加分类的弹出框 -->
    <el-dialog title="添加分类" :visible.sync="addCatDialogFormVisible">
      <el-form
        ref="addform"
        :model="form"
        label-width="80">
        <el-form-item label="分类名称">
          <el-input style="width:400px" v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类列表">
          <!-- {{ catIds }} -->
          <!-- <el-select placeholder="默认添加一级分类">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select> -->
          <!-- 级联选择器
             v-model="catIds": 选中的分类id,数组形式
          -->
          <el-cascader
             clearable
             expand-trigger="hover"
             v-model="catIds"
             :props="defaultProps"
             placeholder="默认添加一级分类"
            :options="options"
            change-on-select
          ></el-cascader>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCatDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetAddCat">确 定</el-button>
      </div>
  </el-dialog>
  </el-card>
</template>

<script>
import elementTreeGrid from 'element-tree-grid';
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      // 添加分类弹出框
      addCatDialogFormVisible: false,
      form: {
        cat_name: ''
      },
      // 分页
      pagenum: 1,
      pagesize: 4,
      total: 0,
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
      currentaPid: 0,
      currentaLevel: 0
    };
  },
  components: {
    elementreeGrid: elementTreeGrid
  },
  created() {
    this.categoriesList();
  },
  methods: {
    // 获取分类数据
    async categoriesList() {
      // 让每一页都显示loading动画
      this.loading = true;
      const response = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      this.loading = false;
      // 响应完成后，获取总条数
      this.total = response.data.data.total;
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data.result;
        // console.log(response);
      } else {
        this.$message.error(msg);
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.categoriesList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.categoriesList();
    },
    // 点击添加分类
    async handleAddCat() {
      // 显示弹出框
      this.addCatDialogFormVisible = true;
      // 发送请求，获取一级和二级数据
      const response = await this.$http.get('categories?type=2');
      console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 成功后，将值赋值给options
        this.options = response.data.data;
      } else {
        this.$message.error(msg);
      }
    },
    // 点击添加分类弹出框的确定按钮
    async handleSetAddCat() {
      // 关闭弹出框
      this.addCatDialogFormVisible = false;
      // 获取三个参数才能发送请求  cat_pid cat_name(this.form.cat_name)  cat_level
      // cat_pid 通过catIds可以获取
      // 级别与存放id 的数组关系
      // this.catIds.length === 0 => cat_level 为0
      // this.catIds.length === 1 => cat_level 为1
      // this.catIds.length === 2 => cat_level 为2
      this.currentaLevel = this.catIds.length;
      if (this.catIds.length === 1) {
        // 默认添加一级分类
        this.currentaPid = this.catIds[0];
      } else if (this.catIds.length === 2) {
        this.currentaPid = this.catIds[1];
      }
      // 发送请求
      const response = await this.$http.post('categories', {
        cat_pid: this.currentaPid,
        cat_name: this.form.cat_name,
        cat_level: this.currentaLevel
      });
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 201) {
        this.$message.success(msg);
        // 关闭弹出框
        this.addCatDialogFormVisible = false;
        // 重新渲染表格
        this.categoriesList();
        // 清空添加的弹出框
        // this.$refs.addform.resetField();
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.addBtn {
    margin: 10px 0;
}
</style>
