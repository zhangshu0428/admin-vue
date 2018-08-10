<template>
    <div class="login-wrap">
      <div>
        <el-form class="login-form" label-position="top" label-width="80px" :model="formData">
            <el-form-item label="用户名">
               <el-input v-model="formData.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="formData.password" @keyup.enter.native="handleLogin"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleLogin" class="btn" type="primary">登录</el-button>
             </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      // 使用async函数和变量赋值
      this.$http
        .post('login', this.formData)
        .then((response) => {
          // console.log(response);
          var status = response.data.meta.status;
          var msg = response.data.meta.msg;
          // console.log(status);
          if (status === 200) {
            // 成功
            // 提示
            this.$message.success(msg);
            // 获取token，存储到本地
            var token = response.data.data.token;
            sessionStorage.setItem('token', token);
            // console.log(token);
            // 跳转,新建home组件，配置路由
            this.$router.push('/');
          } else {
            // 失败
            this.$message.error(msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
  .login-wrap {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-form {
    background-color: #fff;
    width: 400px;
    border-radius: 5px;
    padding: 30px;
  }
  .btn {
    width: 100%;
  }
</style>
