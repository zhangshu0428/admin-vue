<template>
    <el-container class="home-wrap">
        <el-header class="header">
            <el-row>
                <el-col :span="4">
                    <img src="@/assets/logo.png">
                </el-col>
                <el-col :span="19">
                    <h3>电商后台管理系统</h3>
                </el-col>
                <el-col :span="1" class="logout">
                    <a href="#" @click.prevent="handleLogout">退出</a>
                </el-col>
            </el-row>
        </el-header>
        <el-container>
            <el-aside width="200px" class="aside">
              <el-menu
                unique-opened
                router
                class="el-menu-vertical-demo">
                <el-submenu index="1">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>用户管理</span>
                  </template>
                    <el-menu-item index="/users">
                      <i class="el-icon-menu"></i>
                      <span>用户列表</span>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>权限管理</span>
                  </template>
                    <el-menu-item index="/roles">
                      <i class="el-icon-menu"></i>
                      <span>角色列表</span>
                    </el-menu-item>
                    <el-menu-item index="/rights">
                      <i class="el-icon-menu"></i>
                      <span>权限列表</span>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>商品管理</span>
                  </template>
                    <el-menu-item index="/goods">
                      <i class="el-icon-menu"></i>
                      <span>商品列表</span>
                    </el-menu-item>
                    <el-menu-item index="/categoriesParams">
                      <i class="el-icon-menu"></i>
                      <span>分类参数</span>
                    </el-menu-item>
                    <el-menu-item index="/categories">
                      <i class="el-icon-menu"></i>
                      <span>商品分类</span>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>订单管理</span>
                  </template>
                    <el-menu-item index="1-4-1">
                      <i class="el-icon-menu"></i>
                      <span>订单列表</span>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="5">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>数据统计</span>
                  </template>
                    <el-menu-item index="1-4-1">
                      <i class="el-icon-menu"></i>
                      <span>数据列表</span>
                    </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-aside>
            <el-main class="main">
              <!-- 当匹配到导航栏的路由时，显示不同的组件 -->
              <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  beforeCreate() {
    // 页面一上来，判断是否有token
    var token = sessionStorage.getItem('token');
    if (!token) {
      this.$message.warning('请先登录');
      this.$router.push('/login');
    }
  },
  methods: {
    handleLogout() {
      // 清除token
      sessionStorage.removeItem('token');
      // 提示
      this.$message.success('退出成功');
      // 重定向到登陆页
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
    .home-wrap {
       height: 100%;
    }
    .header {
        background-color: #b3c0d1;
        padding-left: 10px;
    }
    .header h3 {
        text-align: center;
        color: #fff;
        font-size: 24px;
        line-height: 16px;
        font-weight: 400;
    }
    .header .logout {
        line-height: 60px;
    }
    .header .logout a {
        color: orange;
    }
    .aside {
        background-color: #d3dce6;
        height: 100%;
    }
    .main {
        background-color: #e9eef3;
    }
</style>
