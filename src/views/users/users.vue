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
            <el-input
            placeholder="请输入内容"
            class="searchPart"
            v-model="searchText"
            clearable>
            <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch"></el-button>
            </el-input>
            <el-button type="success" plain @click="handleAdd">添加用户</el-button>
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
                  <el-button
                  type="primary"
                  icon="el-icon-edit"
                  plain
                  @click="openEditDialog(scope.row)"
                  size="mini"></el-button>
                  <el-button type="success" icon="el-icon-check" plain size="mini"></el-button>
                  <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
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
          :total="count">
        </el-pagination>
        <!-- 添加内容的弹出框 -->
        <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible">
          <el-form :model="form" label-width="80px" :rules="rules" ref="addForm">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="form.mobile" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancel">取 消</el-button>
            <el-button type="primary" @click="handleAddDetails">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 编辑用户的对话框 -->
        <el-dialog
        title="修改用户"
        @close="closeEditDialog"
        :visible.sync="editUserDialogFormVisible">
          <el-form :model="form" label-width="80px" ref="editForm">
            <el-form-item label="用户名称">
              <el-input v-model="form.username" auto-complete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="form.email" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="form.mobile" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editUserDialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleEditDetails">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {

        }
      ],
      pagenum: 1,
      pagesize: 2,
      count: 0,
      searchText: '',
      // 添加用户的弹出框
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的对话框
      addUserDialogFormVisible: false,
      // 编辑用户的对话框
      editUserDialogFormVisible: false,
      // 验证表单
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ]
      }
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
      var response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchText}`);
      // console.log(response);
      // 获取状态码和信息
      var { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 请求成功后获取总条数
        this.count = response.data.data.total;
        this.tableData = response.data.data.users;
      } else {
        this.$message.error(msg);
      }
    },
    // 分页处理：每页显示数目的变化
    handleSizeChange(val) {
      // 当每页显示的条数变化时，给pagesize赋值,发送请求
      this.pagesize = val;
      this.usersList();
    },
    // 分页处理，当前页数变化
    handleCurrentChange(val) {
      // 当前页数变化时，给pagenum赋值,发送请求
      this.pagenum = val;
      this.usersList();
    },
    // 搜索框事件处理
    handleSearch() {
      this.usersList();
    },
    // 处理添加
    handleAdd() {
      // 弹出对话框
      this.addUserDialogFormVisible = true;
    },
    // 点击确定，添加用户的表单
    async handleAddDetails() {
      // 先获取表单，进行验证
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          // 验证成功，发送请求，注意await的用法
          // 发送请求，提示 对话框关闭，重新渲染页面
          var response = await this.$http.post('users', this.form);
          console.log(response);
          const { data: { meta: { status, msg } } } = response;
          if (status === 201) {
            this.$message.success(msg);
            this.addUserDialogFormVisible = false;
            // 重置表单
            this.$refs.addForm.resetFields();
            this.usersList();
          } else {
            this.$message.error(msg);
          }
        } else {
          this.$message.warning('验证失败');
        }
      });
    },
    // 点击取消，对话框消失，重置表单内容
    handleCancel() {
      this.addUserDialogFormVisible = false;
      this.$refs.addForm.resetFields();
    },
    // 点击编辑按钮
    openEditDialog(user) {
      // 弹出对话框
      this.editUserDialogFormVisible = true;
      // 发送请求，获取该行的数据
      console.log(user);
      this.form.username = user.username;
      this.form.email = user.email;
      this.form.mobile = user.mobile;
      // 将id 存入表单中
      this.form.id = user.id;
    },
    // 点击编辑的确定按钮
    async handleEditDetails() {
      // 发送请求
      const response = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });
      // 判断
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 提示
        this.$message.success(msg);
        // 关闭对话框
        this.editUserDialogFormVisible = false;
        // 渲染页面
        this.usersList();
      } else {
        this.$message.error(msg);
      }
    },
    // 关闭对话框
    closeEditDialog() {
      // 清除表单数据
      for (var k in this.form) {
        this.form[k] = '';
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
