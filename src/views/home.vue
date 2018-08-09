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
            <el-aside width="200px" class="aside">Aside</el-aside>
            <el-main class="main">Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
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

<style>
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
    }
    .main {
        background-color: #e9eef3;
    }
</style>
