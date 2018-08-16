<template>
  <el-card class="card">
    <my-breadcrumb level1="订单管理" level2="订单列表"></my-breadcrumb>
    <!-- 表格 -->
    <el-table
      stripe
      border
      :data="tableData"
      style="width: 100%;margin-top:10px;height:430px">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="280">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="100">
      </el-table-column>
      <el-table-column
        label="是否付款">
        <template slot-scope="scope">
          <el-tag type="danger">
            {{ scope.row.order_pay === 0 ? '已付款':'未付款' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="下单时间"
        width="160"
        >
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-button
              @click="openEditDialog"
              type="primary"
              icon="el-icon-edit"
              plain
              size="mini"></el-button>
            </el-row>
          </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form  label-width="100px">
        <el-form-item label="省市区/县">
        <!-- 级联选择器 -->
          <el-cascader
            expand-trigger="hover"
            :options="options"
            v-model="selectedOptions2">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分页-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[8, 16, 24, 32]"
      :page-size="pagesize"
      :pager-count="11"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
import citydata from './city_data2017_element.js';
export default {
  data() {
    return {
      tableData: [],
      // 省市县的数据
      options: [],
      selectedOptions2: [],
      // 对话框默认不显示
      dialogFormVisible: false,
      // 页
      pagenum: 1,
      pagesize: 8,
      total: 0
    };
  },
  created() {
    // 获取订单表格数据
    this.orderList();
  },
  methods: {
    // 获取订单表格数据
    async orderList() {
      const response = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
      console.log(response);
      this.total = response.data.data.total;
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data.goods;
      } else {
        this.$message.error(msg);
      }
    },
    // 打开编辑的对话框
    openEditDialog() {
      this.dialogFormVisible = true;
      this.options = citydata;
    },
    // 分页处理：每页显示数目的变化
    handleSizeChange(val) {
      // 当每页显示的条数变化时，给pagesize赋值,发送请求
      this.pagesize = val;
      this.orderList();
    },
    // 分页处理，当前页数变化
    handleCurrentChange(val) {
      // 当前页数变化时，给pagenum赋值,发送请求
      this.pagenum = val;
      this.orderList();
    }
  }
};
</script>

<style>

</style>
