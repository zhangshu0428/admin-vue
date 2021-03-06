<template>
    <el-card class="card">
    <!-- 面包屑组件
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      stripe
      border
      :data="tableData"
      style="width: 100%;margin-top:10px">
       <el-table-column type="expand">
         <template slot-scope="scope">
            <!-- 放置该行的具体权限 -->
            <el-row v-for="level1 in scope.row.children" :key="level1.id" class="level1">
              <el-col :span="4">
                <!-- 放置一级权限 -->
                <el-tag closable type="success" @close="handleDeleteRight(scope.row, level1.id)">
                  {{ level1.authName }}
                </el-tag>
              </el-col>
              <el-col :span="20">
                <!-- 放置二级权限及三级权限的包裹 -->
                <el-row v-for="level2 in level1.children" :key="level2.id">
                  <el-col :span="4">
                    <!-- 放置二级权限 -->
                    <el-tag closable type="warning" @close="handleDeleteRight(scope.row, level2.id)">
                      {{ level2.authName }}
                    </el-tag>
                  </el-col>
                  <el-col :span="20">
                    <!-- 放置三级权限 -->
                    <el-tag
                    closable
                    v-for="level3 in level2.children" :key="level3.id"
                    @close="handleDeleteRight(scope.row, level3.id)"
                    class="level3">
                      {{ level3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row v-if="scope.row.children.length === 0">没有权限</el-row>
         </template>
       </el-table-column>
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
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
            <el-button
            @click="handleRenderTree(scope.row)"
            type="success"
            icon="el-icon-check"
            plain
            size="mini"></el-button>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置权限的对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="openSetRightsDialogVisible"
      width="60%">
      <!-- 显示树状权限信息 -->
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultChecked"
        :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="openSetRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      openSetRightsDialogVisible: false,
      treeData: [],
      defaultProps: {
        // 指定节点标签是节点对象的某个属性值
        label: 'authName',
        // 指定子树是节点对象的某个属性值
        children: 'children'
      },
      // 默认选中，放置id
      defaultChecked: [],
      // 当前角色id
      currentRoleId: -1
    };
  },
  created() {
    this.rolesList();
  },
  methods: {
    // 发送获取角色列表的请求
    async rolesList() {
      const response = await this.$http.get('roles');
      // console.log(response);
      // 数据加载完后，动画隐藏
      this.loading = false;
      this.tableData = response.data.data;
    },
    // 处理关闭权限标签
    async handleDeleteRight(role, rightId) {
      const response = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        // 重新渲染,直接加载表格用户体验不好，每次都关闭权限标签，所以要重新渲染权限标签
        // 需要给scope.row.children重新赋值从后台获取的数据
        // this.rolesList();
        role.children = response.data.data;
      } else {
        this.$message.error(msg);
      }
    },
    // 发送请求，获取权限
    async handleRenderTree(roles) {
      // roles 是该行用户的所有详细信息，包括权限信息
      // 后期添加：获取当前角色的id
      this.currentRoleId = roles.id;
      this.openSetRightsDialogVisible = true;
      this.defaultChecked = [];
      // 发送请求，获取权限
      const response = await this.$http.get('rights/tree');
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 显示所有的树状结构
        this.treeData = response.data.data;
      } else {
        this.$message.error(msg);
      }
      // 要想默认选中所对应的权限，只需要获取第三级权限的id,放到defaultChecked中
      // 设置完成后，会改变全局的defaultChecked的值，所以要先使该数组的长度为0
      roles.children.forEach((itemOne) => {
        itemOne.children.forEach((itemTwo) => {
          itemTwo.children.forEach((itemThree) => {
            this.defaultChecked.push(itemThree.id);
          });
        });
      });
    },
    // 点击确定，处理权限更改
    async handleSetRights() {
      this.openSetRightsDialogVisible = false;
      // 需要的参数有角色id(currentRole) 和 权限id的列表，以逗号隔开
      // 获取默认选中节点的id,调用tree的方法
      const FullChecked = this.$refs.tree.getCheckedKeys();
      const HalfChecked = this.$refs.tree.getHalfCheckedKeys();
      // console.log(FullChecked, HalfChecked);
      const arr = [...FullChecked, ...HalfChecked];
      // 参数获取完毕，发送请求
      const response = await this.$http.post(`roles/${this.currentRoleId}/rights`, {
        rids: arr.join(',')
      });
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
        // 重新渲染表格
        this.rolesList();
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
.level1,.level3 {
  margin-bottom: 10px;
}
.level3 {
  margin-right: 10px;
}
</style>
