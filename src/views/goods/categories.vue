<template>
  <el-card>
    <!-- 面包屑 -->
    <my-breadcrumb level1="商品管理" level2="商品分类"></my-breadcrumb>
    <el-row>
        <el-button type="success" plain class="addBtn">添加分类</el-button>
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
import elementTreeGrid from 'element-tree-grid';
export default {
  data() {
    return {
      tableData: [],
      loading: true
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
      const response = await this.$http.get('categories');
      this.loading = false;
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data;
        // console.log(this.tableData);
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
