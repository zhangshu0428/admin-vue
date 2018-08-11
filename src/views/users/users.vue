<template>
    <div>
        <!-- 面包屑组件 -->
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb> -->
        <my-breadcrumb level1="用户管理" level2="用户列表"></my-breadcrumb>
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
          v-loading="loading"
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
                @change="handleStateChange(scope.row)"
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
                  <el-button
                  type="danger"
                  icon="el-icon-delete"
                  plain
                  @click="handleDelete(scope.row.id)"
                  size="mini"></el-button>
                  <el-button
                  type="success"
                  icon="el-icon-check"
                  plain
                  @click="openRoleDialog(scope.row)"
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
        <!-- 角色分配 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogFormVisible">
        <el-form label-width="100px">
          <el-form-item label="当前用户">
              {{ currentUserName }}
          </el-form-item>
          <el-form-item label="请选择角色">
            <el-select v-model="currentRoleId">
              <el-option label="请选择" :value="-1" disabled></el-option>
              <el-option
              v-for="item in roles" :key="item.id"
              :label="item.roleName"
              :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSetRole">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      pagenum: 1,
      pagesize: 4,
      count: 0,
      searchText: '',
      // 添加用户的弹出框
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      loading: true,
      // 添加用户的对话框
      addUserDialogFormVisible: false,
      // 编辑用户的对话框
      editUserDialogFormVisible: false,
      // 分配角色的对话框
      setRoleDialogFormVisible: false,
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
      },
      currentUserName: '',
      currentUserId: '',
      currentRoleId: -1,
      roles: []
    };
  },
  created() {
    // 发送请求
    this.usersList();
  },
  methods: {
    async usersList() {
      // 发送请求之前，需要认证token
      // var token = sessionStorage.getItem('token');
      // this.$http.defaults.headers.common['Authorization'] = token;
      var response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchText}`);
      // 数据加载完后，动画隐藏
      this.loading = false;
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
    },
    // 点击删除按钮
    async handleDelete(id) {
      // 弹出对话框
      this.$confirm('确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 点击了确认按钮， 发送删除请求
        const response = await this.$http.delete(`users/${id}`);
        const { meta: { status, msg } } = response.data;
        if (status === 200) {
          this.$message.success(msg);
          // 删除后，如果某一页没有数据了，跳转到前一页
          if (this.tableData.length === 1 && this.pagenum !== 1) {
            this.pagenum--;
          }
          // 重新渲染
          this.usersList();
        }
      }).catch(() => {
        // 点击了取消按钮
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 点击切换开关触发的事件
    async handleStateChange(user) {
      // 发送请求
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 点击分配角色按钮触发的事件
    async openRoleDialog(user) {
      this.setRoleDialogFormVisible = true;
      // 获取用户id和用户名
      this.currentUserName = user.username;
      this.currentUserId = user.id;
      // 发送请求，获取角色id
      const response = await this.$http.get(`roles`);
      // console.log(response);
      var { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 成功后，渲染页面
        this.roles = response.data.data;
      } else {
        this.$message.error(msg);
      };
      // 发送请求，获取当前行用户的角色信息
      const roleResponse = await this.$http.get(`users/${user.id}`);
      // console.log(roleResponse);
      // 成功后，将该用户的roleid赋值给下拉框绑定的变量
      this.currentRoleId = roleResponse.data.data.rid;
      // console.log(this.currentRoleId);
    },
    async handleSetRole() {
      // 关闭弹窗
      this.setRoleDialogFormVisible = false;
      // 发送请求
      const response = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      });
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
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
