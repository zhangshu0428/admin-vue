// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/index.css';
import moment from 'moment';
import axios from 'axios';

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

Vue.use(ElementUI);
// 创建全局过滤器
Vue.filter('fmtDate', (value, fmtString) => {
  return moment(value).format(fmtString);
});

// 将axios配置为全局的，不用每次都导入
Vue.prototype.$http = axios;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
