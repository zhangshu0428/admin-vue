<template>
    <div>
        <!-- 面包屑组件 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 输入框组件 -->
        <el-row>
          <el-col :span="24">
            <el-input placeholder="请输入内容" class="searchPart">
            <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-button type="success" plain>添加用户</el-button>
         </el-col>
        </el-row>
        <el-table
          stripe
          border
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="180">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
              <!-- {{ scope.row.create_time }} -->
            </template>
          </el-table-column>
          <el-table-column
            prop="is_active"
            label="用户状态"
            width="60"
            >
            <template slot-scope="scope">
              <!-- {{ scope.row }} -->
               <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
             <template slot-scope="scope">
                <el-row>
                  <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
                  <el-button type="success" icon="el-icon-check" plain size="mini"></el-button>
                  <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
                </el-row>
             </template>
          </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {

        }
      ]
    };
  },
  created() {
    // 发送请求
    this.usersList();
  },
  methods: {
    async usersList() {
      // 发送请求之前，需要认证token
      var token = sessionStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = token;
      var response = await this.$http.get('users?pagenum=1&pagesize=10');
      console.log(response);
      // 获取状态码和信息
      var { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.tableData = response.data.data.users;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
  .breadcrumb {
    font-size: 14px;
  }
  .searchPart {
    width: 300px;
    margin: 10px 0;
  }
</style>
