<template>
  <el-card class="card">
    <my-breadcrumb level1="商品管理" level2="商品列表"></my-breadcrumb>
    <!-- 输入框组件 -->
    <el-row class="row">
      <el-col :span="24">
        <el-input
        placeholder="请输入内容"
        class="searchPart"
        clearable>
        <el-button
        slot="append"
        icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="tableData"
      style="width: 100%;height:400px">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="500">
      </el-table-column>
      <el-table-column
        prop="goods_price"
        label="商品价格(元)"
        width="100">
      </el-table-column>
      <el-table-column
        prop="goods_weight"
        label="商品重量"
        width="80">
      </el-table-column>
      <el-table-column
        prop="add_time"
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.add_time | fmtDate('YYYY-MM-DD') }}
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
      :pager-count="11"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      tableData: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.goodsList();
  },
  methods: {
    // 获取商品列表
    async goodsList() {
      const response = await this.$http.get(`goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      // 请求发送完成，取消加载动画
      this.loading = false;
      console.log(response);
      // 获取数据总条数
      this.total = response.data.data.total;
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data.goods;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页处理：每页显示数目的变化
    handleSizeChange(val) {
      // 当每页显示的条数变化时，给pagesize赋值,发送请求
      this.pagesize = val;
      this.goodsList();
    },
    // 分页处理，当前页数变化
    handleCurrentChange(val) {
      // 当前页数变化时，给pagenum赋值,发送请求
      this.pagenum = val;
      this.goodsList();
    }
  }
};
</script>

<style>
.searchPart {
    width: 400px;
}
.row {
    margin: 10px 0;
}
.el-table .cell {
  white-space: nowrap;
}
</style>
